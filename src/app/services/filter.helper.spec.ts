import {Song} from '../modules/songs/services/song';
import {createSongScorer, filterSong} from './filter.helper';

describe('Filter Helper', () => {
  const song: Song = {
    title: 'Song Title',
    text: "This is a songtext, aa?bb!cc,dd.ee'ff",
    legalOwner: 'other',
    label: '',
    id: '',
    legalType: 'open',
    artist: '',
    comment: '',
    edits: [],
    final: false,
    flags: '',
    key: '',
    number: 1,
    legalOwnerId: '',
    origin: '',
    status: 'draft',
    tempo: 10,
    type: 'Misc',
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

  it('should find contracted title when searching full adjective', () => {
    void expect(filterSong({...song, title: "Heil'ger Geist"}, 'Heiliger Geist')).toBe(true);
  });

  it('should find shortened title without apostrophe when searching full adjective', () => {
    void expect(filterSong({...song, title: 'Heilger Geist'}, 'Heiliger Geist')).toBe(true);
  });

  it('should find full adjective when searching shortened title', () => {
    void expect(filterSong({...song, title: 'Heiliger Geist'}, 'Heilger Geist')).toBe(true);
  });

  it('should find contracted accusative form when searching full wording', () => {
    void expect(filterSong({...song, text: "Komm, du ew'gen Geist"}, 'ewigen Geist')).toBe(true);
  });

  it('should find full wording when searching contracted accusative form', () => {
    void expect(filterSong({...song, text: 'Komm, du ewigen Geist'}, "ew'gen Geist")).toBe(true);
  });

  it('should not find unrelated shortened wording', () => {
    void expect(filterSong({...song, title: 'Heilig Geist'}, 'Heiliger Geist')).toBe(false);
  });

  it('should rank exact title matches above text matches', () => {
    const scoreSong = createSongScorer('Heiliger Geist');
    const titleMatch = scoreSong({...song, title: 'Heiliger Geist', text: 'anderer Text'});
    const textMatch = scoreSong({...song, title: 'anderer Titel', text: 'Komm Heiliger Geist in diese Stadt'});

    void expect(titleMatch).toBeGreaterThan(textMatch);
  });
});
