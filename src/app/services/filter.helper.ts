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

export function dynamicSort(property: string) {
  let sortOrder = 1;
  if (property[0] === '-') {
    sortOrder = -1;
    property = property.substr(1);
  }
  return function (a: unknown, b: unknown) {
    /* next line works with strings and numbers,
     * and you may want to customize it to your needs
     */
    const result = a[property] < b[property] ? -1 : a[property] > b[property] ? 1 : 0;
    return result * sortOrder;
  };
}
