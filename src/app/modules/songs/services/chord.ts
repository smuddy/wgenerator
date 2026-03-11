export interface ChordAddDescriptor {
  raw: string;
  quality: 'major' | 'minor' | 'diminished' | 'augmented' | null;
  extensions: string[];
  additions: string[];
  suspensions: string[];
  alterations: string[];
  modifiers: string[];
}

export interface ChordValidationIssue {
  lineNumber: number;
  lineText: string;
  token: string;
  suggestion: string | null;
  reason: 'alias' | 'minor_format' | 'major_format' | 'invalid_suffix' | 'unknown_token' | 'tab_character';
  message: string;
}

export interface Chord {
  chord: string;
  length: number;
  position: number;
  slashChord: string | null;
  add: string | null;
  addDescriptor?: ChordAddDescriptor | null;
  prefix?: string;
  suffix?: string;
}
