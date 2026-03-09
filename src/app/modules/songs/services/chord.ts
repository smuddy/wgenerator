export interface ChordAddDescriptor {
  raw: string;
  quality: 'major' | 'minor' | 'diminished' | 'augmented' | null;
  extensions: string[];
  additions: string[];
  suspensions: string[];
  alterations: string[];
  modifiers: string[];
}

export interface Chord {
  chord: string;
  length: number;
  position: number;
  slashChord: string | null;
  add: string | null;
  addDescriptor?: ChordAddDescriptor | null;
}
