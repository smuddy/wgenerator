export const KEYS = [
  'C', 'C#', 'Db', 'D', 'D#', 'Eb', 'E', 'F', 'F#', 'Gb', 'G', 'G#', 'Ab', 'A', 'A#', 'B', 'H',
  'c', 'c#', 'db', 'd', 'd#', 'eb', 'e', 'f', 'f#', 'gb', 'g', 'g#', 'ab', 'a', 'a#', 'b', 'h'
];
export const KEYS_MAJOR_FLAT = [
  'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'H',
];
export const KEYS_MAJOR_B = [
  'C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'B', 'H',
];
export const KEYS_MINOR_FLAT = [
  'c', 'c#', 'd', 'd#', 'e', 'f', 'f#', 'g', 'g#', 'a', 'a#', 'h',
];
export const KEYS_MINOR_B = [
  'c', 'db', 'd', 'eb', 'e', 'f', 'gb', 'g', 'ab', 'a', 'b', 'h',
];

const scaleAssignment = {
  'C': KEYS_MAJOR_FLAT,
  'C#': KEYS_MAJOR_FLAT,
  'Db': KEYS_MAJOR_B,
  'D': KEYS_MAJOR_B,
  'D#': KEYS_MAJOR_FLAT,
  'Eb': KEYS_MAJOR_B,
  'E': KEYS_MAJOR_FLAT,
  'F': KEYS_MAJOR_B,
  'F#': KEYS_MAJOR_FLAT,
  'Gb': KEYS_MAJOR_B,
  'G': KEYS_MAJOR_FLAT,
  'G#': KEYS_MAJOR_FLAT,
  'Ab': KEYS_MAJOR_B,
  'A': KEYS_MAJOR_FLAT,
  'A#': KEYS_MAJOR_FLAT,
  'B': KEYS_MAJOR_B,
  'H': KEYS_MAJOR_FLAT,
  'c': KEYS_MINOR_FLAT,
  'c#': KEYS_MINOR_FLAT,
  'db': KEYS_MINOR_B,
  'd': KEYS_MINOR_B,
  'd#': KEYS_MINOR_FLAT,
  'eb': KEYS_MINOR_B,
  'e': KEYS_MINOR_FLAT,
  'f': KEYS_MINOR_B,
  'f#': KEYS_MINOR_FLAT,
  'gb': KEYS_MINOR_B,
  'g': KEYS_MINOR_FLAT,
  'g#': KEYS_MINOR_FLAT,
  'ab': KEYS_MINOR_B,
  'a': KEYS_MINOR_FLAT,
  'a#': KEYS_MINOR_FLAT,
  'b': KEYS_MINOR_B,
  'h': KEYS_MINOR_FLAT,
};

export const scaleMapping = {
  'C': 'C',
  'C#': 'C♯',
  'Db': 'D♭',
  'D': 'D',
  'D#': 'D♯',
  'Eb': 'E♭',
  'E': 'E',
  'F': 'F',
  'F#': 'F♯',
  'Gb': 'D♭',
  'G': 'G',
  'G#': 'G♯',
  'Ab': 'A♭',
  'A': 'A',
  'A#': 'A♯',
  'B': 'B',
  'H': 'H',
  'c': 'c',
  'c#': 'c♯',
  'db': 'd♭',
  'd': 'd',
  'd#': 'd♯',
  'eb': 'e♭',
  'e': 'e',
  'f': 'f',
  'f#': 'f♯',
  'gb': 'g♭',
  'g': 'g',
  'g#': 'g♯',
  'ab': 'a♭',
  'a': 'a',
  'a#': 'a♯',
  'b': 'b',
  'h': 'h',
};

export const getScale = (key: string): string[] => {
  const scaleAssignmentElement = scaleAssignment[key];
  return scaleAssignmentElement;
};
