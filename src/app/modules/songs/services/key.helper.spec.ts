import {getScale, scaleMapping} from './key.helper';

describe('key.helper', () => {
  it('should render Gb correctly', () => {
    expect(scaleMapping['Gb']).toBe('G♭');
  });

  it('should expose a sharp-based scale for D', () => {
    expect(getScale('D')).toEqual(['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'H']);
  });

  it('should keep flat-based spelling for Db', () => {
    expect(getScale('Db')).toEqual(['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'B', 'H']);
  });
});
