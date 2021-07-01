import {Song} from '../modules/songs/services/song';
import {filterSong} from './filter.helper';

describe('Filter Helper', () => {
  const song: Song = {
    title: 'Song Title',
    text: "This is a songtext, aa?bb!cc,dd.ee'ff",
    legalOwner: '',
    label: '',
    id: '',
    legalType: '',
    artist: '',
    comment: '',
    edits: [],
    final: false,
    flags: '',
    key: '',
    number: 1,
    legalOwnerId: '',
    origin: '',
    status: '',
    tempo: 10,
    type: '',
    termsOfUse: '',
  };

  it('should not find song', () => {
    void expect(filterSong(song, 'nope')).toBe(false);
  });

  it('should find song by title', () => {
    void expect(filterSong(song, 'Song Title')).toBe(true);
  });

  it('should find song by text', () => {
    void expect(filterSong(song, 'This is a songtext')).toBe(true);
  });

  it('should find with spaces', () => {
    void expect(filterSong(song, 'SongTitle')).toBe(true);
  });

  it('should find ordinal invariant', () => {
    void expect(filterSong(song, 'songtitle')).toBe(true);
  });

  it('should find ? invariant', () => {
    void expect(filterSong(song, 'aabb')).toBe(true);
  });

  it('should find ! invariant', () => {
    void expect(filterSong(song, 'bbcc')).toBe(true);
  });

  it('should find , invariant', () => {
    void expect(filterSong(song, 'ccdd')).toBe(true);
  });

  it('should find . invariant', () => {
    void expect(filterSong(song, 'ddee')).toBe(true);
  });

  it('should find apostroph invariant', () => {
    void expect(filterSong(song, 'eeff')).toBe(true);
  });
});
