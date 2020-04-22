import {ChordMode} from '../../../widget-modules/components/song-text/song-text.component';

export interface ShowSong {
  id: string;
  songId: string;
  key: string;
  keyOriginal: string;
  order: number;
  chordMode: ChordMode;
  addedLive: boolean;
}
