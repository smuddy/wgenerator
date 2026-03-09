import {Song} from '../songs/services/song';
import {Timestamp} from '@angular/fire/firestore';

export interface GuestShow {
  id: string;
  showType: string;
  date: Timestamp;
  songs: Song[];
}
