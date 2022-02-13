import firebase from 'firebase/compat/app';
import Timestamp = firebase.firestore.Timestamp;

export interface Show {
  id: string;
  showType: string;
  date: Timestamp;
  owner: string;
  public: boolean;
  reported: boolean;
  published: boolean;
  archived: boolean;
  order: string[];

  presentationSongId: string;
  presentationSection: number;
  presentationZoom: number;
}
