import {LegalOwnerPipe} from './legal-owner.pipe';

describe('LegalOwnerPipe', () => {
  it('create an instance', () => {
    const pipe = new LegalOwnerPipe();
    void expect(pipe).toBeTruthy();
  });
});
