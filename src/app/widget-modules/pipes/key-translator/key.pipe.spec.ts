import {KeyPipe} from './key.pipe';

describe('KeyPipe', () => {
  it('create an instance', () => {
    const pipe = new KeyPipe();
    void expect(pipe).toBeTruthy();
  });
});
