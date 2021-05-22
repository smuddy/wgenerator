import {Song} from '../modules/songs/services/song';

export function filterSong(song: Song, filterValue: string): boolean {
  if (!filterValue) {
    return true;
  }

  const textMatch = !!song.text && normalize(song.text).indexOf(normalize(filterValue)) !== -1;
  const titleMatch = !!song.title && normalize(song.title).indexOf(normalize(filterValue)) !== -1;

  return textMatch || titleMatch;
}

function normalize(input: string): string {
  return input.toLowerCase().replace(/\s/g, '');
}
