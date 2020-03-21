import {Injectable} from '@angular/core';

export enum SectionType {
  Verse,
  Chorus,
  Bridge,
}

export enum LineType {
  chord,
  text,
}

export interface Chord {
  chord: string;
  length: number;
  position: number;
  slashChord?: string;
  add?: string;
}

export interface Line {
  type: LineType;
  text: string;
  chords?: Chord[]
}

export interface Section {
  type: SectionType;
  number: number;
  lines: Line[];
}

@Injectable({
  providedIn: 'root'
})
export class TextRenderingService {
  private regexSection = /(Strophe|Refrain|Bridge)/;

  constructor() {
  }

  public parse(text: string): Section[] {
    const arrayOfLines = text.split(/\r?\n/).filter(_ => _);
    const indices = {
      [SectionType.Bridge]: 0,
      [SectionType.Chorus]: 0,
      [SectionType.Verse]: 0,
    };
    const sections = arrayOfLines.reduce((array, line) => {
      const type = this.getSectionTypeOfLine(line);
      if (line.match(this.regexSection)) return [...array, {
        type: type,
        number: indices[type]++,
        lines: []
      }];
      array[array.length - 1].lines.push(this.getLineOfLineText(line));
      return array;
    }, [] as Section[]);
    console.log(indices);

    return sections;
  }

  private getLineOfLineText(text: string): Line {
    if (!text) return null;
    const cords = this.readChords(text);
    const hasMatches = cords.length > 0;
    const type = hasMatches ? LineType.chord : LineType.text;

    return {type, text, chords: hasMatches ? cords : undefined}
  }

  private getSectionTypeOfLine(line: string): SectionType {
    if (!line) return null;
    const match = line.match(this.regexSection);
    if (!match || match.length < 2) return null;
    const typeString = match[1];
    switch (typeString) {
      case  "Strophe":
        return SectionType.Verse;
      case  "Refrain":
        return SectionType.Chorus;
      case  "Bridge":
        return SectionType.Bridge;
    }
  }

  private readChords(chordLine: string): Chord[] {
    let match;
    const chords: Chord[] = [];

    // https://regex101.com/r/68jMB8/3
    const regex = /\b(C#|C|Db|D#|D|Eb|E|F#|F|Gb|G#|G|Ab|A#|A|B|H|c#|c|db|d#|d|eb|e|f#|f|gb|g#|g|ab|a#|a|b|h)(\/(C#|C|Db|D#|D|Eb|E|F#|F|Gb|G#|G|Ab|A#|A|B|H|c#|c|db|d#|d|eb|e|f#|f|gb|g#|g|ab|a#|a|b|h))?(\d+|maj7)?\s?\b/mg;

    while ((match = regex.exec(chordLine)) !== null) {
      const chord: Chord = {
        chord: match[1],
        length: match[0].length,
        position: regex.lastIndex - match[0].length,
      };
      if (match[3]) chord.slashChord = match[3];
      if (match[4]) chord.add = match[4];

      chords.push(chord);
    }
    return chords;
  }

}
