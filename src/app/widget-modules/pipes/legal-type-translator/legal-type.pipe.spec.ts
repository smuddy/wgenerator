import {LegalTypePipe} from './legal-type.pipe';

describe('LegalTypePipe', () => {
  it('create an instance', () => {
    const pipe = new LegalTypePipe();
    void expect(pipe).toBeTruthy();
  });
});
