import {ShowTypePipe} from './show-type.pipe';

describe('ShowTypePipe', () => {
  it('create an instance', () => {
    const pipe = new ShowTypePipe();
    void expect(pipe).toBeTruthy();
  });
});
