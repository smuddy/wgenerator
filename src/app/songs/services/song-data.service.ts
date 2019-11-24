import {Injectable} from '@angular/core';
import {AngularFirestore, AngularFirestoreCollection} from '@angular/fire/firestore';
import {Song} from '../models/song';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SongDataService {
  private songCollection: AngularFirestoreCollection<Song>;
  private readonly songs: Observable<Song[]>;

  constructor(private afs: AngularFirestore) {
    this.songCollection = afs.collection<Song>('songs');
    this.songs = this.songCollection.snapshotChanges().pipe(map(actions => {
      return actions.map(a => ({
        ...a.payload.doc.data(),
        id: a.payload.doc.id
      }));
    }));
  }

  public list = (): Observable<Song[]> => this.songs;
  public read = (songId: string): Observable<Song | undefined> =>
    this.afs.doc<Song>('songs/' + songId).valueChanges().pipe(map(song => ({
      ...song,
      id: songId
    } as Song)))


}
