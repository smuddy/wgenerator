import {StatusPipe} from './status.pipe';

describe('StatusPipe', () => {
  it('create an instance', () => {
    const pipe = new StatusPipe();
    void expect(pipe).toBeTruthy();
  });
});
