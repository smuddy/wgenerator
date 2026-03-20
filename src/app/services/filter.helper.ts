import {Song} from '../modules/songs/services/song';

export function filterSong(song: Song, filterValue: string): boolean {
  return createSongFilter(filterValue)(song);
}

export function createSongFilter(filterValue: string): (song: Song) => boolean {
  if (!filterValue) return () => true;

  const filter = analyzeSearchText(filterValue);
  return (song: Song) => {
    const searchableSong = getSearchableSong(song);
    return matchesAnalysis(searchableSong.text, filter) || matchesAnalysis(searchableSong.title, filter) || matchesAnalysis(searchableSong.artist, filter);
  };
}

type SearchAnalysis = {
  compact: string,
  tokens: string[],
};

type SearchableSong = {
  text?: SearchAnalysis,
  title?: SearchAnalysis,
  artist?: SearchAnalysis,
};

const searchableSongCache = new WeakMap<Song, SearchableSong>();

function matchesAnalysis(haystack: SearchAnalysis | undefined, filter: SearchAnalysis): boolean {
  if (!haystack) return false;

  return haystack.compact.includes(filter.compact) || matchesTokenSequence(haystack.tokens, filter.tokens);
}

function analyzeSearchText(input: string): SearchAnalysis {
  const tokens = tokenizeForSearch(input);
  return {
    compact: tokens.join(''),
    tokens,
  };
}

function matchesTokenSequence(haystackTokens: string[], needleTokens: string[]): boolean {
  if (needleTokens.length === 0 || haystackTokens.length < needleTokens.length) return false;

  for (let start = 0; start <= haystackTokens.length - needleTokens.length; start++) {
    const matches = needleTokens.every((needleToken, index) => haystackTokens[start + index] === needleToken);
    if (matches) return true;
  }

  return false;
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
