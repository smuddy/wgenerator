export interface KeyFilterSelection {
  root: string;
  mode: string;
  accidental: string;
  includeRelativeMinor: boolean;
}

export const KEY_FILTER_ROOTS = [
  {value: '', label: 'Alle'},
  {value: 'C', label: 'C'},
  {value: 'D', label: 'D'},
  {value: 'E', label: 'E'},
  {value: 'F', label: 'F'},
  {value: 'G', label: 'G'},
  {value: 'A', label: 'A'},
  {value: 'H', label: 'H'},
];

export const KEY_FILTER_MODES = [
  {value: 'major', label: 'Dur'},
  {value: 'minor', label: 'Moll'},
];

export const KEY_FILTER_ACCIDENTALS = [
  {value: '', label: 'keins'},
  {value: 'sharp', label: '#'},
  {value: 'flat', label: 'b'},
];

const rootSemitones: {[root: string]: number} = {
  C: 0,
  D: 2,
  E: 4,
  F: 5,
  G: 7,
  A: 9,
  H: 11,
};

const sharpKeysBySemitone = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'H'];
const flatKeysBySemitone = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'B', 'H'];

const relativeMinorByMajorKey: {[key: string]: string} = {
  C: 'a',
  'C#': 'a#',
  Db: 'b',
  D: 'h',
  'D#': 'c',
  Eb: 'c',
  E: 'c#',
  F: 'd',
  'F#': 'd#',
  Gb: 'eb',
  G: 'e',
  'G#': 'f',
  Ab: 'f',
  A: 'f#',
  'A#': 'g',
  B: 'g',
  H: 'g#',
};

const relativeMajorByMinorKey: {[key: string]: string} = Object.fromEntries(Object.entries(relativeMinorByMajorKey).map(([majorKey, minorKey]) => [minorKey, majorKey]));

export const matchesKeyFilter = (songKey: string, filter: KeyFilterSelection): boolean => {
  if (!filter.root) {
    return true;
  }

  return getKeysForFilter(filter).includes(songKey);
};

export const getKeysForFilter = (filter: KeyFilterSelection): string[] => {
  const keys = new Set<string>();
  const majorKey = getKeyForRoot(filter.root, 'major', filter.accidental);
  const minorKey = getKeyForRoot(filter.root, 'minor', filter.accidental);

  if (filter.mode !== 'minor' && majorKey) {
    keys.add(majorKey);
  }

  if (filter.mode !== 'major' && minorKey) {
    keys.add(minorKey);
  }

  if (filter.includeRelativeMinor && filter.mode !== 'minor' && majorKey && relativeMinorByMajorKey[majorKey]) {
    keys.add(relativeMinorByMajorKey[majorKey]);
  }

  if (filter.includeRelativeMinor && filter.mode !== 'major' && minorKey && relativeMajorByMinorKey[minorKey]) {
    keys.add(relativeMajorByMinorKey[minorKey]);
  }

  return [...keys];
};

export const supportsKeyAccidental = (root: string, accidental: string): boolean => {
  return !root || rootSemitones[root] !== undefined || !accidental;
};

export const hasAvailableKeyForRoot = (root: string, availableKeys: string[]): boolean => {
  if (!root) {
    return true;
  }

  const available = new Set(availableKeys.filter(key => !!key));
  return KEY_FILTER_MODES.some(mode =>
    KEY_FILTER_ACCIDENTALS.some(accidental =>
      getKeysForFilter({
        root,
        mode: mode.value,
        accidental: accidental.value,
        includeRelativeMinor: false,
      }).some(key => available.has(key)),
    ),
  );
};

const getKeyForRoot = (root: string, mode: 'major' | 'minor', accidental: string): string => {
  const semitone = rootSemitones[root];
  if (semitone === undefined) {
    return '';
  }

  const offset = accidental === 'sharp' ? 1 : accidental === 'flat' ? -1 : 0;
  const normalizedSemitone = (semitone + offset + 12) % 12;
  const key = accidental === 'flat' ? flatKeysBySemitone[normalizedSemitone] : sharpKeysBySemitone[normalizedSemitone];

  return mode === 'minor' ? key.toLowerCase() : key;
};
