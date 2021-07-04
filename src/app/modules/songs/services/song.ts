import firebase from 'firebase/app';
import Timestamp = firebase.firestore.Timestamp;

export interface Song {
  id: string;
  comment: string;
  final: boolean;
  key: string;
  number: number;
  tempo: number;
  text: string;
  title: string;
  type: string;
  flags: string;
  status: string;

  legalType: string;
  legalOwner: string;
  legalOwnerId: string;

  artist: string;
  label: string;
  termsOfUse: string;
  origin: string;

  edits: Edit[];
}

export interface Edit {
  username: string;
  timestamp: Timestamp;
}
