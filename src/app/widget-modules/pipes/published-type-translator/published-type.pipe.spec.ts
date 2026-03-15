import {PublishedTypePipe} from './published-type.pipe';

describe('PublishedTypePipe', () => {
  it('create an instance', () => {
    const pipe = new PublishedTypePipe();
    void expect(pipe).toBeTruthy();
  });

  it('should translate publication state', () => {
    const pipe = new PublishedTypePipe();

    expect(pipe.transform(true)).toBe('veröffentlicht');
    expect(pipe.transform(false)).toBe('unveröffentlicht');
  });
});
