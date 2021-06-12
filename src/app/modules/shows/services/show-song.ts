import {ChordMode} from '../../../widget-modules/components/song-text/song-text.component';
import {Song} from '../../songs/services/song';

export interface ShowSong extends Song {
  id: string;
  songId: string;
  key: string;
  keyOriginal: string;
  chordMode: ChordMode;
  addedLive: boolean;
}
