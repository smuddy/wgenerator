import {TestBed} from '@angular/core/testing';

import {TransposeService} from './transpose.service';
import {LineType} from './line-type';
import {Line} from './line';

describe('TransposeService', () => {
  let service: TransposeService;

  beforeEach(() => {
    void TestBed.configureTestingModule({});
    service = TestBed.inject(TransposeService);
  });

  it('should create map upwards', () => {
    const map = service.getMap('D', 'G');

    if (map) {
      void expect(map['D']).toBe('G');
    }
  });

  it('should create map downwards', () => {
    const map = service.getMap('G', 'D');

    if (map) {
      void expect(map['G']).toBe('D');
    }
  });

  it('should transpose enharmonic targets by semitone distance', () => {
    const distance = service.getDistance('C', 'Db');
    const map = service.getMap('C', 'Db');

    void expect(distance).toBe(1);
    void expect(map?.['C']).toBe('Db');
    void expect(map?.['G']).toBe('Ab');
  });

  it('should keep german B/H notation consistent', () => {
    const distance = service.getDistance('H', 'C');
    const map = service.getMap('H', 'C');

    void expect(distance).toBe(1);
    void expect(map?.['H']).toBe('C');
    void expect(map?.['B']).toBe('H');
  });

  it('should render unknown chords as X', () => {
    const line: Line = {
      type: LineType.chord,
      text: '',
      chords: [{chord: 'Q', add: 'sus4', slashChord: null, position: 0, length: 1}],
    };

    const rendered = service.renderChords(line);

    void expect(rendered.text).toBe('Xsus4');
  });

  it('should render unknown slash chords as X', () => {
    const line: Line = {
      type: LineType.chord,
      text: '',
      chords: [{chord: 'C', add: null, slashChord: 'Q', position: 0, length: 1}],
    };

    const rendered = service.renderChords(line);

    void expect(rendered.text).toBe('C/X');
  });

  it('should transpose lines with long chord positions without truncating', () => {
    const line: Line = {
      type: LineType.chord,
      text: '',
      chords: [{chord: 'C', add: null, slashChord: null, position: 120, length: 1}],
    };

    const rendered = service.renderChords(line);

    void expect(rendered.text.length).toBe(121);
    void expect(rendered.text.endsWith('C')).toBeTrue();
  });
});
