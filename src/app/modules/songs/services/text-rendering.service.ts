import {Injectable, inject} from '@angular/core';
import {TransposeService} from './transpose.service';
import {TransposeMode} from './transpose-mode';
import {SectionType} from './section-type';
import {Section} from './section';
import {LineType} from './line-type';
import {Chord, ChordAddDescriptor} from './chord';
import {Line} from './line';

@Injectable({
  providedIn: 'root',
})
export class TextRenderingService {
  private transposeService = inject(TransposeService);

  private readonly regexSection = /^\s*(Strophe|Refrain|Bridge)\b/i;
  private readonly chordRoots = [
    'C#',
    'Db',
    'D#',
    'Eb',
    'F#',
    'Gb',
    'G#',
    'Ab',
    'A#',
    'C',
    'D',
    'E',
    'F',
    'G',
    'A',
    'B',
    'H',
    'c#',
    'db',
    'd#',
    'eb',
    'f#',
    'gb',
    'g#',
    'ab',
    'a#',
    'c',
    'd',
    'e',
    'f',
    'g',
    'a',
    'b',
    'h',
  ] as const;
  private readonly suffixKeywords = ['moll', 'verm', 'maj', 'min', 'dur', 'dim', 'aug', 'sus', 'add', 'm'] as const;
  private readonly suffixChars = new Set(['#', 'b', '+', '-', '(', ')']);

  public parse(text: string, transpose: TransposeMode | null, withComments = true): Section[] {
    if (!text) {
      return [];
    }

    const indices = {
      [SectionType.Bridge]: 0,
      [SectionType.Chorus]: 0,
      [SectionType.Verse]: 0,
    };
    const sections: Section[] = [];

    for (const line of text.split(/\r?\n/)) {
      if (!line || this.isCommentLine(line, withComments)) {
        continue;
      }

      const type = this.getSectionTypeOfLine(line);
      if (type !== null) {
        sections.push({
          type,
          number: indices[type]++,
          lines: [],
        });
        continue;
      }

      if (sections.length === 0) {
        continue;
      }

      const renderedLine = this.getLineOfLineText(line, transpose);
      if (renderedLine) {
        sections[sections.length - 1].lines.push(renderedLine);
      }
    }

    return sections;
  }

  private getLineOfLineText(text: string, transpose: TransposeMode | null): Line | null {
    if (!text) return null;

    const chords = this.readChords(text);
    const hasMatches = chords.length > 0;
    const type = hasMatches ? LineType.chord : LineType.text;

    const line: Line = {type, text, chords: hasMatches ? chords : null};
    return transpose !== null && transpose !== undefined ? this.transposeService.transpose(line, transpose.baseKey, transpose.targetKey) : this.transposeService.renderChords(line);
  }

  private getSectionTypeOfLine(line: string): SectionType | null {
    if (!line) {
      return null;
    }
    const match = this.regexSection.exec(line);
    if (!match || match.length < 2) {
      return null;
    }
    const typeString = match[1].toLowerCase();
    switch (typeString) {
      case 'strophe':
        return SectionType.Verse;
      case 'refrain':
        return SectionType.Chorus;
      case 'bridge':
        return SectionType.Bridge;
    }

    return null;
  }

  private readChords(chordLine: string): Chord[] {
    const chords: Chord[] = [];
    const tokens = chordLine.match(/\S+/g) ?? [];

    for (const token of tokens) {
      const position = chordLine.indexOf(token, chords.length > 0 ? chords[chords.length - 1].position + chords[chords.length - 1].length : 0);
      const chord = this.parseChordToken(token, position);
      if (chord) {
        chords.push(chord);
      }
    }

    const chordCount = chords.reduce((acc: number, cur: Chord) => acc + cur.length, 0);
    const lineCount = chordLine.replace(/\s/g, '').length;
    const isChordLine = chordCount * 1.2 > lineCount;
    return isChordLine ? chords : [];
  }

  private isCommentLine(line: string, withComments: boolean): boolean {
    return !withComments && line.trimStart().startsWith('#');
  }

  private parseChordToken(token: string, position: number): Chord | null {
    const root = this.readChordRoot(token, 0);
    if (!root) {
      return null;
    }

    let cursor = root.length;
    const suffix = this.readChordSuffix(token, cursor);
    cursor += suffix.length;

    let slashChord: string | null = null;
    if (token[cursor] === '/') {
      const slash = this.readChordRoot(token, cursor + 1);
      if (!slash) {
        return null;
      }
      slashChord = slash;
      cursor += 1 + slash.length;
    }

    if (cursor !== token.length) {
      return null;
    }

    return {
      chord: root,
      length: token.length,
      position,
      slashChord,
      add: suffix || null,
      addDescriptor: this.parseChordAddDescriptor(suffix || null),
    };
  }

  private readChordRoot(token: string, start: number): string | null {
    return this.chordRoots.find(root => token.startsWith(root, start)) ?? null;
  }

  private readChordSuffix(token: string, start: number): string {
    let cursor = start;
    let suffix = '';

    while (cursor < token.length) {
      const keyword = this.suffixKeywords.find(entry => token.startsWith(entry, cursor));
      if (keyword) {
        suffix += keyword;
        cursor += keyword.length;
        continue;
      }

      const char = token[cursor];
      if (this.isDigit(char) || this.suffixChars.has(char)) {
        suffix += char;
        cursor += 1;
        continue;
      }

      break;
    }

    return suffix;
  }

  private isDigit(char: string | undefined): boolean {
    return !!char && char >= '0' && char <= '9';
  }

  private parseChordAddDescriptor(suffix: string | null): ChordAddDescriptor | null {
    if (!suffix) {
      return null;
    }

    let rest = suffix;
    let quality: ChordAddDescriptor['quality'] = null;

    const qualityMatchers: Array<[string, NonNullable<ChordAddDescriptor['quality']>]> = [
      ['moll', 'minor'],
      ['min', 'minor'],
      ['maj', 'major'],
      ['dur', 'major'],
      ['dim', 'diminished'],
      ['verm', 'diminished'],
      ['aug', 'augmented'],
      ['m', 'minor'],
    ];

    for (const [prefix, normalized] of qualityMatchers) {
      if (rest.startsWith(prefix)) {
        quality = normalized;
        rest = rest.slice(prefix.length);
        break;
      }
    }

    const descriptor: ChordAddDescriptor = {
      raw: suffix,
      quality,
      extensions: [],
      additions: [],
      suspensions: [],
      alterations: [],
      modifiers: [],
    };

    while (rest.length > 0) {
      const additionMatch = rest.match(/^add([#b+\-]?\d+)/);
      if (additionMatch) {
        descriptor.additions.push(additionMatch[1]);
        rest = rest.slice(additionMatch[0].length);
        continue;
      }

      const suspensionMatch = rest.match(/^sus(\d*)/);
      if (suspensionMatch) {
        descriptor.suspensions.push(suspensionMatch[1] || 'sus');
        rest = rest.slice(suspensionMatch[0].length);
        continue;
      }

      const extensionMatch = rest.match(/^\d+/);
      if (extensionMatch) {
        descriptor.extensions.push(extensionMatch[0]);
        rest = rest.slice(extensionMatch[0].length);
        continue;
      }

      const alterationMatch = rest.match(/^[#b+\-]\d+/);
      if (alterationMatch) {
        descriptor.alterations.push(alterationMatch[0]);
        rest = rest.slice(alterationMatch[0].length);
        continue;
      }

      const modifierMatch = rest.match(/^\([^)]*\)/);
      if (modifierMatch) {
        descriptor.modifiers.push(modifierMatch[0]);
        rest = rest.slice(modifierMatch[0].length);
        continue;
      }

      descriptor.modifiers.push(rest);
      break;
    }

    return descriptor;
  }
}
