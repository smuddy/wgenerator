import {getScale, hasAvailableKeyForRoot, matchesKeyFilter, scaleMapping, supportsKeyAccidental} from './key.helper';

describe('key.helper', () => {
  it('should render Gb correctly', () => {
    void expect(scaleMapping['Gb']).toBe('G♭');
  });

  it('should expose a sharp-based scale for D', () => {
    void expect(getScale('D')).toEqual(['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'H']);
  });

  it('should keep flat-based spelling for Db', () => {
    void expect(getScale('Db')).toEqual(['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'B', 'H']);
  });

  it('should match songs by root, mode and accidental', () => {
    void expect(matchesKeyFilter('Db', {root: 'D', mode: 'major', accidental: 'flat', includeRelativeMinor: false})).toBe(true);
    void expect(matchesKeyFilter('d#', {root: 'D', mode: 'minor', accidental: 'sharp', includeRelativeMinor: false})).toBe(true);
    void expect(matchesKeyFilter('D', {root: 'D', mode: 'minor', accidental: '', includeRelativeMinor: false})).toBe(false);
  });

  it('should include both major and minor when no mode is selected', () => {
    void expect(matchesKeyFilter('G', {root: 'G', mode: '', accidental: '', includeRelativeMinor: false})).toBe(true);
    void expect(matchesKeyFilter('g', {root: 'G', mode: '', accidental: '', includeRelativeMinor: false})).toBe(true);
  });

  it('should include the relative minor for major keys when requested', () => {
    void expect(matchesKeyFilter('a', {root: 'C', mode: 'major', accidental: '', includeRelativeMinor: true})).toBe(true);
    void expect(matchesKeyFilter('h', {root: 'D', mode: 'major', accidental: '', includeRelativeMinor: true})).toBe(true);
    void expect(matchesKeyFilter('e', {root: 'G', mode: 'major', accidental: '', includeRelativeMinor: true})).toBe(true);
  });

  it('should include the relative minor when all modes are selected', () => {
    void expect(matchesKeyFilter('a', {root: 'C', mode: '', accidental: '', includeRelativeMinor: true})).toBe(true);
  });

  it('should include the relative major for minor keys when requested', () => {
    void expect(matchesKeyFilter('C', {root: 'A', mode: 'minor', accidental: '', includeRelativeMinor: true})).toBe(true);
    void expect(matchesKeyFilter('G', {root: 'E', mode: 'minor', accidental: '', includeRelativeMinor: true})).toBe(true);
  });

  it('should normalize enharmonic edge spellings to stored keys', () => {
    void expect(matchesKeyFilter('F', {root: 'E', mode: 'major', accidental: 'sharp', includeRelativeMinor: false})).toBe(true);
    void expect(matchesKeyFilter('e', {root: 'F', mode: 'minor', accidental: 'flat', includeRelativeMinor: false})).toBe(true);
    void expect(matchesKeyFilter('H', {root: 'C', mode: 'major', accidental: 'flat', includeRelativeMinor: false})).toBe(true);
    void expect(matchesKeyFilter('C', {root: 'H', mode: 'major', accidental: 'sharp', includeRelativeMinor: false})).toBe(true);
  });

  it('should allow every accidental for every root', () => {
    void expect(supportsKeyAccidental('E', 'sharp')).toBe(true);
    void expect(supportsKeyAccidental('F', 'flat')).toBe(true);
  });

  it('should detect whether a root has any available stored key', () => {
    void expect(hasAvailableKeyForRoot('C', ['C'])).toBe(true);
    void expect(hasAvailableKeyForRoot('E', ['F'])).toBe(true);
    void expect(hasAvailableKeyForRoot('H', ['C'])).toBe(true);
    void expect(hasAvailableKeyForRoot('D', ['F', 'a'])).toBe(false);
  });

  it('should not enable a root only because its relative counterpart exists', () => {
    void expect(hasAvailableKeyForRoot('A', ['C'])).toBe(false);
    void expect(hasAvailableKeyForRoot('C', ['a'])).toBe(false);
  });

  it('should not apply a key filter before a root is selected', () => {
    void expect(matchesKeyFilter('Db', {root: '', mode: 'major', accidental: 'flat', includeRelativeMinor: true})).toBe(true);
  });
});
