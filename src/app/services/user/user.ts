import {ChordMode} from '../../widget-modules/components/song-text/song-text.component';
import {roles} from './roles';

export interface User {
  id: string;
  name: string;
  role: roles;
  chordMode: ChordMode
}
