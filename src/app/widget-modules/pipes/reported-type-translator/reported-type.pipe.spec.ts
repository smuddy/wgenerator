import {ReportedTypePipe} from './reported-type.pipe';

describe('ReportedTypePipe', () => {
  it('create an instance', () => {
    const pipe = new ReportedTypePipe();
    void expect(pipe).toBeTruthy();
  });

  it('should translate report states', () => {
    const pipe = new ReportedTypePipe();

    expect(pipe.transform('pending')).toBe('nicht gemeldet');
    expect(pipe.transform('reported')).toBe('gemeldet');
    expect(pipe.transform('not-required')).toBe('Meldung nicht notwendig');
    expect(pipe.transform(null)).toBe('');
  });
});
