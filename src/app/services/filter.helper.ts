import {Song} from '../modules/songs/services/song';

export function filterSong(song: Song, filterValue: string): boolean {
  return scoreSongMatch(song, filterValue) > 0;
}

export function createSongFilter(filterValue: string): (song: Song) => boolean {
  const scorer = createSongScorer(filterValue);
  return (song: Song) => scorer(song) > 0;
}

export function searchSongs<T extends Song>(songs: T[], filterValue: string): T[] {
  const matchesSongFilter = createSongFilter(filterValue);
  const compareSongs = createSongSearchComparator(filterValue);
  return songs.filter(matchesSongFilter).sort(compareSongs);
}

export function scoreSongMatch(song: Song, filterValue: string): number {
  return createSongScorer(filterValue)(song);
}

export function createSongScorer(filterValue: string): (song: Song) => number {
  if (!filterValue) return () => 1;

  const filter = analyzeSearchText(filterValue);
  return (song: Song) => {
    const searchableSong = getSearchableSong(song);
    const titleScore = scoreAnalysis(searchableSong.title, filter, 1000);
    const artistScore = scoreAnalysis(searchableSong.artist, filter, 700);
    const textScore = scoreAnalysis(searchableSong.text, filter, 400);
    return Math.max(titleScore, artistScore, textScore);
  };
}

export function createSongSearchComparator(filterValue: string): (a: Song, b: Song) => number {
  const scoreSong = createSongScorer(filterValue);
  return (a: Song, b: Song) => {
    if (filterValue) {
      const scoreDiff = scoreSong(b) - scoreSong(a);
      if (scoreDiff !== 0) return scoreDiff;
    }

    const titleCompare = (a.title ?? '').localeCompare(b.title ?? '');
    if (titleCompare !== 0) return titleCompare;

    return a.number - b.number;
  };
}

type SearchAnalysis = {
  compact: string;
  tokens: string[];
};

type SearchableSong = {
  text?: SearchAnalysis;
  title?: SearchAnalysis;
  artist?: SearchAnalysis;
};

const searchableSongCache = new WeakMap<Song, SearchableSong>();

function scoreAnalysis(haystack: SearchAnalysis | undefined, filter: SearchAnalysis, fieldWeight: number): number {
  if (!haystack || !filter.compact) return 0;

  const compactIndex = haystack.compact.indexOf(filter.compact);
  const tokenIndex = findTokenSequenceIndex(haystack.tokens, filter.tokens);

  if (compactIndex === -1 && tokenIndex === -1) return 0;

  if (haystack.compact === filter.compact) return fieldWeight + 500;
  if (tokenIndex === 0) return fieldWeight + 350;
  if (compactIndex === 0) return fieldWeight + 250;
  if (tokenIndex !== -1) return fieldWeight + 150;
  return fieldWeight + 50;
}

function analyzeSearchText(input: string): SearchAnalysis {
  const tokens = tokenizeForSearch(input);
  return {
    compact: tokens.join(''),
    tokens,
  };
}

function findTokenSequenceIndex(haystackTokens: string[], needleTokens: string[]): number {
  if (needleTokens.length === 0 || haystackTokens.length < needleTokens.length) return -1;

  for (let start = 0; start <= haystackTokens.length - needleTokens.length; start++) {
    const matches = needleTokens.every((needleToken, index) => haystackTokens[start + index] === needleToken);
    if (matches) return start;
  }

  return -1;
}

function tokenizeForSearch(input: string): string[] {
  return input
    .normalize('NFKD')
    .toLowerCase()
    .replace(/\p{M}/gu, '')
    .split(/[^\p{L}\p{N}']+/gu)
    .map(normalizeTokenForSearch)
    .filter(token => !!token);
}

function normalizeTokenForSearch(token: string): string {
  const cleaned = token.replace(/'/g, '');
  return cleaned.replace(/ig(e|em|en|er|es)?$/u, 'g$1');
}

function getSearchableSong(song: Song): SearchableSong {
  const cached = searchableSongCache.get(song);
  if (cached) return cached;

  const searchableSong: SearchableSong = {
    text: song.text ? analyzeSearchText(song.text) : undefined,
    title: song.title ? analyzeSearchText(song.title) : undefined,
    artist: song.artist ? analyzeSearchText(song.artist) : undefined,
  };
  searchableSongCache.set(song, searchableSong);
  return searchableSong;
}

export const onlyUnique = <T>(value: T, index: number, array: T[]) => array.indexOf(value) === index;

export function dynamicSort<T extends Record<string, string | number>>(property: keyof T | `-${string & keyof T}`) {
  let sortOrder = 1;
  let resolvedProperty = property as string;
  if (resolvedProperty[0] === '-') {
    sortOrder = -1;
    resolvedProperty = resolvedProperty.slice(1);
  }
  return function (a: T, b: T): number {
    const left = a[resolvedProperty as keyof T];
    const right = b[resolvedProperty as keyof T];
    const result = left < right ? -1 : left > right ? 1 : 0;
    return result * sortOrder;
  };
}
