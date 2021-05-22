import {LineType} from './line-type';
import {Chord} from './chord';

export interface Line {
  type: LineType;
  text: string;
  chords: Chord[] | null;
}
