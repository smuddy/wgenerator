import {SortByPipe} from './sort-by.pipe';

describe('SortByPipe', () => {
  it('create an instance', () => {
    const pipe = new SortByPipe();
    void expect(pipe).toBeTruthy();
  });
});
