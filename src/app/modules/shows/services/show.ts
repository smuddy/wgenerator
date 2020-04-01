import * as firebase from 'firebase';
import Timestamp = firebase.firestore.Timestamp;

export interface Show {
  id: string;
  showType: string;
  date: Timestamp;
  owner: string;
  public: boolean;
  reported: boolean;

  presentationSongId: string;
  presentationSection: number;
  presentationZoom: number;

}

