import {Injectable} from '@angular/core';
import {TransposeService} from './transpose.service';
import {TransposeMode} from './transpose-mode';
import {SectionType} from './section-type';
import {Section} from './section';
import {LineType} from './line-type';
import {Chord} from './chord';
import {Line} from './line';

@Injectable({
  providedIn: 'root',
})
export class TextRenderingService {
  private regexSection = /(Strophe|Refrain|Bridge)/;

  public constructor(private transposeService: TransposeService) {}

  public parse(text: string, transpose: TransposeMode | null): Section[] {
    if (!text) {
      return [];
    }
    const arrayOfLines = text.split(/\r?\n/).filter(_ => _);
    const indices = {
      [SectionType.Bridge]: 0,
      [SectionType.Chorus]: 0,
      [SectionType.Verse]: 0,
    };
    return arrayOfLines.reduce((array, line) => {
      const type = this.getSectionTypeOfLine(line);
      if (this.regexSection.exec(line) && type !== null) {
        const section: Section = {
          type,
          number: indices[type]++,
          lines: [],
        };
        return [...array, section];
      }
      const lineOfLineText = this.getLineOfLineText(line, transpose);
      if (array.length === 0) return array;
      if (lineOfLineText) array[array.length - 1].lines.push(lineOfLineText);
      return array;
    }, [] as Section[]);
  }

  private getLineOfLineText(text: string, transpose: TransposeMode | null): Line | null {
    if (!text) return null;

    const cords = this.readChords(text);
    const hasMatches = cords.length > 0;
    const type = hasMatches ? LineType.chord : LineType.text;

    const line: Line = {type, text, chords: hasMatches ? cords : null};
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
    const typeString = match[1];
    switch (typeString) {
      case 'Strophe':
        return SectionType.Verse;
      case 'Refrain':
        return SectionType.Chorus;
      case 'Bridge':
        return SectionType.Bridge;
    }

    return null;
  }

  private readChords(chordLine: string): Chord[] {
    let match: string[] | null;
    const chords: Chord[] = [];

    // https://regex101.com/r/68jMB8/5
    const regex =
      /(C#|C|Db|D#|D|Eb|E|F#|F|Gb|G#|G|Ab|A#|A|B|H|c#|c|db|d#|d|eb|e|f#|f|gb|g#|g|ab|a#|a|b|h)(\/(C#|C|Db|D#|D|Eb|E|F#|F|Gb|G#|G|Ab|A#|A|B|H|c#|c|db|d#|d|eb|e|f#|f|gb|g#|g|ab|a#|a|b|h))?(\d+|maj7)?/gm;

    while ((match = regex.exec(chordLine)) !== null) {
      const chord: Chord = {
        chord: match[1],
        length: match[0].length,
        position: regex.lastIndex - match[0].length,
        slashChord: null,
        add: null,
      };
      if (match[3]) {
        chord.slashChord = match[3];
      }
      if (match[4]) {
        chord.add = match[4];
      }

      chords.push(chord);
    }

    const chordCount = chords.reduce((acc: number, cur: Chord) => acc + cur.length, 0);
    const lineCount = chordLine.replace(/\s/g, '').length;
    const isChrod = chordCount * 1.2 > lineCount;
    return isChrod ? chords : [];
  }
}
