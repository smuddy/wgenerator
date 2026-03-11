import {Injectable, inject} from '@angular/core';
import {TransposeService} from './transpose.service';
import {TransposeMode} from './transpose-mode';
import {SectionType} from './section-type';
import {Section} from './section';
import {LineType} from './line-type';
import {Chord, ChordAddDescriptor, ChordValidationIssue} from './chord';
import {Line} from './line';

interface ParsedValidationToken {
  prefix: string;
  root: string;
  suffix: string;
  slashChord: string | null;
  rootWasAlias: boolean;
  slashWasAlias: boolean;
  tokenSuffix: string;
}

interface ChordLineValidationResult {
  issues: ChordValidationIssue[];
  isChordLike: boolean;
}

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
  private readonly alternativeChordRoots: Record<string, string> = {
    Ais: 'A#',
    ais: 'a#',
    As: 'Ab',
    as: 'ab',
    Cis: 'C#',
    cis: 'c#',
    Des: 'Db',
    des: 'db',
    Dis: 'D#',
    dis: 'd#',
    Es: 'Eb',
    es: 'eb',
    Fis: 'F#',
    fis: 'f#',
    Ges: 'Gb',
    ges: 'gb',
    Gis: 'G#',
    gis: 'g#',
    Hb: 'B',
    hb: 'b',
  };

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

    for (const [lineIndex, line] of text.split(/\r?\n/).entries()) {
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

      const renderedLine = this.getLineOfLineText(line, transpose, lineIndex + 1);
      if (renderedLine) {
        sections[sections.length - 1].lines.push(renderedLine);
      }
    }

    return sections;
  }

  public validateChordNotation(text: string, withComments = true): ChordValidationIssue[] {
    if (!text) {
      return [];
    }

    const issues: ChordValidationIssue[] = [];
    const lines = text.split(/\r?\n/);

    lines.forEach((line, lineIndex) => {
      if (!line || this.isCommentLine(line, withComments) || this.getSectionTypeOfLine(line) !== null) {
        return;
      }

      const validationResult = this.getChordLineValidationResult(line, lineIndex + 1);
      issues.push(...validationResult.issues);
    });

    return issues;
  }

  private getLineOfLineText(text: string, transpose: TransposeMode | null, lineNumber?: number): Line | null {
    if (!text) return null;

    const chords = this.readChords(text);
    const validationResult = lineNumber ? this.getChordLineValidationResult(text, lineNumber) : {issues: [], isChordLike: false};
    const validationIssues = validationResult.issues;
    const hasMatches = chords.length > 0;
    const isChordLikeLine = hasMatches || validationResult.isChordLike;
    const type = isChordLikeLine ? LineType.chord : LineType.text;

    const line: Line = {type, text, chords: hasMatches ? chords : null, lineNumber};
    if (validationIssues.length > 0 || (!hasMatches && isChordLikeLine)) {
      return line;
    }

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

  private getChordLineValidationResult(line: string, lineNumber: number): ChordLineValidationResult {
    const tokens = line.match(/\S+/g) ?? [];
    const parsedTokens = tokens
      .map(token => ({
        token,
        parsed: this.parseValidationToken(token),
      }));

    const recognizedTokens = parsedTokens.filter((entry): entry is {token: string; parsed: ParsedValidationToken} => entry.parsed !== null);

    const parsedLength = recognizedTokens.reduce((sum, entry) => sum + entry.token.length, 0);
    const compactLineLength = line.replace(/\s/g, '').length;
    const strictlyChordLike = compactLineLength > 0 && parsedLength * 1.2 > compactLineLength;
    const heuristicallyChordLike = tokens.length >= 2 && recognizedTokens.length >= Math.ceil(tokens.length * 0.6);
    const isChordLike = strictlyChordLike || heuristicallyChordLike;

    if (!isChordLike) {
      return {issues: [], isChordLike: false};
    }

    const issues: ChordValidationIssue[] = [];
    if (line.includes('\t')) {
      issues.push(this.createTabCharacterIssue(line, lineNumber));
    }

    return {
      issues: [
        ...issues,
        ...parsedTokens
          .map(entry => {
          if (!entry.parsed) {
            return this.createUnknownTokenIssue(line, lineNumber, entry.token);
          }

          return this.createValidationIssue(line, lineNumber, entry.token, entry.parsed);
        })
          .filter((issue): issue is ChordValidationIssue => issue !== null),
      ],
      isChordLike: true,
    };
  }

  private isCommentLine(line: string, withComments: boolean): boolean {
    return !withComments && line.trimStart().startsWith('#');
  }

  private parseChordToken(token: string, position: number): Chord | null {
    const decoratedToken = this.splitTokenDecorators(token);
    const root = this.readChordRoot(decoratedToken.core, 0);
    if (!root) {
      return null;
    }

    let cursor = root.length;
    const suffix = this.readChordSuffix(decoratedToken.core, cursor);
    cursor += suffix.length;

    let slashChord: string | null = null;
    if (decoratedToken.core[cursor] === '/') {
      const slash = this.readChordRoot(decoratedToken.core, cursor + 1);
      if (!slash) {
        return null;
      }
      slashChord = slash;
      cursor += 1 + slash.length;
    }

    if (cursor !== decoratedToken.core.length) {
      return null;
    }

    return {
      chord: root,
      length: token.length,
      position,
      slashChord,
      add: suffix || null,
      addDescriptor: this.parseChordAddDescriptor(suffix || null),
      prefix: decoratedToken.prefix || undefined,
      suffix: decoratedToken.suffix || undefined,
    };
  }

  private readChordRoot(token: string, start: number): string | null {
    return this.chordRoots.find(root => token.startsWith(root, start)) ?? null;
  }

  private readValidationChordRoot(token: string, start: number): {root: string; length: number; wasAlias: boolean} | null {
    const directMatch = this.readChordRoot(token, start);
    if (directMatch) {
      return {root: directMatch, length: directMatch.length, wasAlias: false};
    }

    const aliasMatch = Object.entries(this.alternativeChordRoots).find(([alias]) => token.startsWith(alias, start));
    if (!aliasMatch) {
      return null;
    }

    return {root: aliasMatch[1], length: aliasMatch[0].length, wasAlias: true};
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

  private readValidationChordSuffix(token: string, start: number): string {
    let cursor = start;
    let suffix = '';

    while (cursor < token.length) {
      const keyword = this.suffixKeywords.find(entry => token.slice(cursor, cursor + entry.length).toLowerCase() === entry);
      if (keyword) {
        suffix += token.slice(cursor, cursor + keyword.length);
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

  private parseValidationToken(token: string): ParsedValidationToken | null {
    const decoratedToken = this.splitTokenDecorators(token);
    const root = this.readValidationChordRoot(decoratedToken.core, 0);
    if (!root) {
      return null;
    }

    let cursor = root.length;
    const suffix = this.readValidationChordSuffix(decoratedToken.core, cursor);
    cursor += suffix.length;

    let slashChord: string | null = null;
    let slashWasAlias = false;
    if (decoratedToken.core[cursor] === '/') {
      const slash = this.readValidationChordRoot(decoratedToken.core, cursor + 1);
      if (!slash) {
        return null;
      }
      slashChord = slash.root;
      slashWasAlias = slash.wasAlias;
      cursor += 1 + slash.length;
    }

    if (cursor !== decoratedToken.core.length) {
      return null;
    }

    return {
      prefix: decoratedToken.prefix,
      root: root.root,
      suffix,
      slashChord,
      rootWasAlias: root.wasAlias,
      slashWasAlias,
      tokenSuffix: decoratedToken.suffix,
    };
  }

  private createValidationIssue(line: string, lineNumber: number, token: string, parsed: ParsedValidationToken): ChordValidationIssue | null {
    const suggestion = this.getCanonicalChordToken(parsed);
    if (suggestion === token) {
      return null;
    }

    if (parsed.rootWasAlias || parsed.slashWasAlias) {
      return {
        lineNumber,
        lineText: line,
        token,
        suggestion,
        reason: 'alias',
        message: `Bitte #/b statt is/es verwenden: ${suggestion}`,
      };
    }

    const descriptor = this.parseChordAddDescriptor(parsed.suffix);
    if (descriptor?.quality === 'minor' && this.isMajorRoot(parsed.root)) {
      return {
        lineNumber,
        lineText: line,
        token,
        suggestion,
        reason: 'minor_format',
        message: `Mollakkorde bitte mit kleinem Grundton schreiben: ${suggestion}`,
      };
    }

    if (this.isMinorRoot(parsed.root) && descriptor?.quality === 'major') {
      return {
        lineNumber,
        lineText: line,
        token,
        suggestion,
        reason: 'major_format',
        message: `Durakkorde bitte mit grossem Grundton schreiben: ${suggestion}`,
      };
    }

    if (parsed.suffix !== this.normalizeSuffix(parsed.suffix)) {
      return {
        lineNumber,
        lineText: line,
        token,
        suggestion,
        reason: 'invalid_suffix',
        message: `Bitte die vorgegebene Akkordschreibweise verwenden: ${suggestion}`,
      };
    }

    return null;
  }

  private createUnknownTokenIssue(line: string, lineNumber: number, token: string): ChordValidationIssue {
    return {
      lineNumber,
      lineText: line,
      token,
      suggestion: null,
      reason: 'unknown_token',
      message: 'Unbekannter Akkord oder falsche Schreibweise',
    };
  }

  private createTabCharacterIssue(line: string, lineNumber: number): ChordValidationIssue {
    return {
      lineNumber,
      lineText: line,
      token: '\t',
      suggestion: null,
      reason: 'tab_character',
      message: 'Tabulatoren sind in Akkordzeilen nicht erlaubt, bitte Leerzeichen verwenden',
    };
  }

  private getCanonicalChordToken(parsed: ParsedValidationToken): string {
    const descriptor = this.parseChordAddDescriptor(parsed.suffix);
    const normalizedSuffix = this.normalizeSuffix(parsed.suffix);

    let root = parsed.root;
    let suffix = normalizedSuffix;

    if (descriptor?.quality === 'minor') {
      root = this.toMinorRoot(root);
      suffix = this.stripLeadingMinorMarker(normalizedSuffix);
    } else if (descriptor?.quality === 'major') {
      root = this.toMajorRoot(root);
      suffix = this.stripLeadingDurMarker(normalizedSuffix);
    }

    const slashChord = parsed.slashChord
      ? (this.isMinorRoot(root) ? this.toMinorRoot(parsed.slashChord) : this.toMajorRoot(parsed.slashChord))
      : null;

    return parsed.prefix + root + suffix + (slashChord ? `/${slashChord}` : '') + parsed.tokenSuffix;
  }

  private normalizeSuffix(suffix: string): string {
    if (!suffix) {
      return suffix;
    }

    let rest = suffix;
    let normalized = '';

    const prefixMap: Array<[string, string]> = [
      ['moll', 'moll'],
      ['min', 'min'],
      ['maj', 'maj'],
      ['dur', 'dur'],
      ['dim', 'dim'],
      ['verm', 'verm'],
      ['aug', 'aug'],
      ['sus', 'sus'],
      ['add', 'add'],
      ['m', 'm'],
    ];

    while (rest.length > 0) {
      const keyword = prefixMap.find(([key]) => rest.slice(0, key.length).toLowerCase() === key);
      if (keyword) {
        normalized += keyword[1];
        rest = rest.slice(keyword[0].length);
        continue;
      }

      normalized += rest[0];
      rest = rest.slice(1);
    }

    return normalized;
  }

  private stripLeadingMinorMarker(suffix: string): string {
    return suffix.replace(/^(moll|min|m)/, '');
  }

  private stripLeadingDurMarker(suffix: string): string {
    return suffix.replace(/^dur/, '');
  }

  private isMajorRoot(root: string): boolean {
    return root[0] === root[0].toUpperCase();
  }

  private isMinorRoot(root: string): boolean {
    return root[0] === root[0].toLowerCase();
  }

  private toMinorRoot(root: string): string {
    return root[0].toLowerCase() + root.slice(1);
  }

  private toMajorRoot(root: string): string {
    return root[0].toUpperCase() + root.slice(1);
  }

  private splitTokenDecorators(token: string): {prefix: string; core: string; suffix: string} {
    const prefixMatch = token.match(/^\(+/);
    const suffixMatch = token.match(/\)+$/);
    const prefix = prefixMatch?.[0] ?? '';
    const suffix = suffixMatch?.[0] ?? '';
    const core = token.slice(prefix.length, token.length - suffix.length);

    return {
      prefix,
      core,
      suffix,
    };
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
