import {ChordMode} from '../../widget-modules/components/song-text/song-text.component';

export interface User {
  id: string;
  name: string;
  role: 'admin';
  chordMode: ChordMode
}
