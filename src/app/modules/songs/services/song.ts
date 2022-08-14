import firebase from 'firebase/compat/app';
import {SongLegalOwner, SongLegalType, SongStatus, SongType} from './song.service';
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
  type: SongType;
  flags: string;
  status: SongStatus;

  legalType: SongLegalType;
  legalOwner: SongLegalOwner;
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
