import {Injectable} from '@angular/core';
import {Chord, Line, LineType} from './text-rendering.service';
import {getScaleType, scaleMapping} from './key.helper';

export interface TransposeMode {
  baseKey: string;
  targetKey: string
}

@Injectable({
  providedIn: 'root'
})
export class TransposeService {

  public transpose(line: Line, baseKey: string, targetKey: string): Line {
    if (line.type !== LineType.chord) return line;
    const difference = this.getDistance(baseKey, targetKey);
    const map = this.getMap(baseKey, difference);

    const chords = line.chords.map(chord => this.transposeChord(chord, map));
    const renderedLine = this.renderLine(chords);

    return {...line, text: renderedLine, chords};
  }

  public getDistance(baseKey: string, targetKey: string): number {
    const scale = getScaleType(baseKey);
    return (
      (scale[0].indexOf(targetKey) - scale[0].indexOf(baseKey)) ??
      (scale[1].indexOf(targetKey) - scale[1].indexOf(baseKey))
    ) % 12;
  }

  public getMap(baseKey: string, difference: number) {
    const scale = getScaleType(baseKey);
    const map = {};
    for (let i = 0; i < 12; i++) {
      const source = scale[0][i];
      const mappedIndex = (i + difference) % 12;
      map[source] = scale[0][mappedIndex];
    }
    for (let i = 0; i < 12; i++) {
      const source = scale[1][i];
      const mappedIndex = (i + difference) % 12;
      map[source] = scale[1][mappedIndex];
    }

    return map;
  }

  private transposeChord(chord: Chord, map: {}): Chord {
    const translatedChord = map[chord.chord];
    const translatedSlashChord = chord.slashChord ? map[chord.slashChord] : null;
    return {...chord, chord: translatedChord, slashChord: translatedSlashChord};
  }

  private renderLine(chords: Chord[]): string {
    let template = '                                                                                                    ';

    chords.forEach(chord => {
      const pos = chord.position;
      const renderedChord = this.renderChord(chord);
      const newLength = renderedChord.length;

      const pre = template.substr(0, pos);
      const post = template.substr(pos + newLength);

      template = pre + renderedChord + post;
    })

    return template.trimRight();
  }

  private renderChord(chord: Chord) {
    return (
      scaleMapping[chord.chord] +
      (chord.add ? chord.add : '') +
      (chord.slashChord ? '/' + scaleMapping[chord.slashChord] : ''));
  }
}
