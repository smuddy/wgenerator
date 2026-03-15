import {Song} from '../modules/songs/services/song';

export function filterSong(song: Song, filterValue: string): boolean {
  if (!filterValue) return true;

  const textMatch = !!song.text && normalize(song.text)?.indexOf(normalize(filterValue)) !== -1;
  const titleMatch = !!song.title && normalize(song.title)?.indexOf(normalize(filterValue)) !== -1;
  const artistMatch = !!song.title && normalize(song.artist)?.indexOf(normalize(filterValue)) !== -1;

  return textMatch || titleMatch || artistMatch;
}

function normalize(input: string): string {
  return input?.toLowerCase().replace(/[\s?!.,']/g, '');
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
