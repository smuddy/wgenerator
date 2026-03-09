import {Injectable} from '@angular/core';
import {getScaleType, scaleMapping} from './key.helper';
import {LineType} from './line-type';
import {Chord} from './chord';
import {Line} from './line';

type TransposeMap = {[key: string]: string};
type ScaleVariants = [string[], string[]];

@Injectable({
  providedIn: 'root',
})
export class TransposeService {
  private readonly enharmonicAliases: Array<[string, string]> = [
    ['C#', 'Db'],
    ['D#', 'Eb'],
    ['F#', 'Gb'],
    ['G#', 'Ab'],
    ['A#', 'B'],
    ['c#', 'db'],
    ['d#', 'eb'],
    ['f#', 'gb'],
    ['g#', 'ab'],
    ['a#', 'b'],
  ];

  private readonly keyToSemitone: Record<string, number> = {
    C: 0,
    'C#': 1,
    Db: 1,
    D: 2,
    'D#': 3,
    Eb: 3,
    E: 4,
    F: 5,
    'F#': 6,
    Gb: 6,
    G: 7,
    'G#': 8,
    Ab: 8,
    A: 9,
    'A#': 10,
    B: 10,
    H: 11,
    c: 0,
    'c#': 1,
    db: 1,
    d: 2,
    'd#': 3,
    eb: 3,
    e: 4,
    f: 5,
    'f#': 6,
    gb: 6,
    g: 7,
    'g#': 8,
    ab: 8,
    a: 9,
    'a#': 10,
    b: 10,
    h: 11,
  };

  private readonly mapCache = new Map<string, TransposeMap>();

  public transpose(line: Line, baseKey: string, targetKey: string): Line {
    if (line.type !== LineType.chord || !line.chords) return line;

    const difference = this.getDistance(baseKey, targetKey);
    const map = this.getMap(baseKey, targetKey, difference);

    const chords = difference !== 0 && map ? line.chords.map(chord => this.transposeChord(chord, map)) : line.chords;
    const renderedLine = this.renderLine(chords);

    return {...line, text: renderedLine, chords};
  }

  public renderChords(line: Line): Line {
    if (line.type !== LineType.chord) {
      return line;
    }

    const renderedLine = this.renderLine(line.chords ?? []);
    return {...line, text: renderedLine};
  }

  public getDistance(baseKey: string, targetKey: string): number {
    const baseSemitone = this.keyToSemitone[baseKey];
    const targetSemitone = this.keyToSemitone[targetKey];

    if (baseSemitone === undefined || targetSemitone === undefined) {
      return 0;
    }

    return (targetSemitone - baseSemitone + 12) % 12;
  }

  public getMap(baseKey: string, targetKey: string, difference: number): TransposeMap | null {
    const cacheKey = `${baseKey}:${targetKey}:${difference}`;
    const cachedMap = this.mapCache.get(cacheKey);
    if (cachedMap) {
      return cachedMap;
    }

    const sourceScales = this.getScaleVariants(baseKey);
    const targetScales = this.getScaleVariants(targetKey);
    if (!sourceScales || !targetScales) {
      return null;
    }

    const map: TransposeMap = {};
    sourceScales.forEach((sourceScale, scaleIndex) => {
      const targetScale = targetScales[scaleIndex];
      for (let i = 0; i < 12; i++) {
        const source = sourceScale[i];
        const mappedIndex = (i + difference + 12) % 12;
        map[source] = targetScale[mappedIndex];
      }
    });

    this.enharmonicAliases.forEach(([left, right]) => {
      if (map[left] && !map[right]) {
        map[right] = map[left];
      }
      if (map[right] && !map[left]) {
        map[left] = map[right];
      }
    });

    this.mapCache.set(cacheKey, map);
    return map;
  }

  private transposeChord(chord: Chord, map: TransposeMap): Chord {
    const translatedChord = map[chord.chord] ?? 'X';
    const translatedSlashChord = chord.slashChord ? (map[chord.slashChord] ?? 'X') : null;

    return {
      ...chord,
      chord: translatedChord,
      slashChord: translatedSlashChord,
    };
  }

  private renderLine(chords: Chord[]): string {
    const width = chords.reduce((max, chord) => {
      return Math.max(max, chord.position + this.renderChord(chord).length);
    }, 0);

    let template = ''.padEnd(width, ' ');

    chords.forEach(chord => {
      const pos = chord.position;
      const renderedChord = this.renderChord(chord);
      const newLength = renderedChord.length;

      if (template.length < pos + newLength) {
        template = template.padEnd(pos + newLength, ' ');
      }

      const pre = template.slice(0, pos);
      const post = template.slice(pos + newLength);

      template = pre + renderedChord + post;
    });

    return template.trimEnd();
  }

  private renderChord(chord: Chord): string {
    const renderedChord = scaleMapping[chord.chord] ?? 'X';
    const renderedSlashChord = chord.slashChord ? (scaleMapping[chord.slashChord] ?? 'X') : '';

    return renderedChord + (chord.add ?? '') + (renderedSlashChord ? '/' + renderedSlashChord : '');
  }

  private getScaleVariants(key: string): ScaleVariants | null {
    const scales = getScaleType(key);
    return scales ? [scales[0], scales[1]] : null;
  }
}
