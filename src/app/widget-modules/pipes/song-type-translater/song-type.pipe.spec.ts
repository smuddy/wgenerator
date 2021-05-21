import {SongTypePipe} from './song-type.pipe';

describe('SongTypePipe', () => {
  it('create an instance', () => {
    const pipe = new SongTypePipe();
    void expect(pipe).toBeTruthy();
  });
});
