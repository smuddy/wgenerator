import {Injectable} from '@angular/core';
import {AngularFirestore, AngularFirestoreCollection} from '@angular/fire/firestore';
import {Song} from '../models/song';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SongDataService {
  private songCollection: AngularFirestoreCollection<Song>;
  private songs: Observable<Song[]>;

  constructor(private afs: AngularFirestore) {
    this.songCollection = afs.collection<Song>('songs');
    this.songs = this.songCollection.valueChanges();
  }

  public list = (): Observable<Song[]> => this.songs;

}
