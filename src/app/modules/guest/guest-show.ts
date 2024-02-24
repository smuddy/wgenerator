import firebase from 'firebase/compat/app';
import {Song} from '../songs/services/song';
import Timestamp = firebase.firestore.Timestamp;

export interface GuestShow {
  id: string;
  showType: string;
  date: Timestamp;
  songs: Song[];
}
