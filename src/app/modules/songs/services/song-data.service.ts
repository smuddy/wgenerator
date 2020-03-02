import {Injectable} from '@angular/core';
import {AngularFirestore, AngularFirestoreCollection} from '@angular/fire/firestore';
import {Song} from '../models/song';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {AngularFirestoreDocument} from '@angular/fire/firestore/document/document';

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

  public getSongRef = (songId: string): AngularFirestoreDocument<Song> => this.afs.doc<Song>('songs/' + songId);

  public read(songId: string): Observable<Song | undefined> {
    return this.getSongRef(songId).valueChanges().pipe(map(song => ({
      ...song,
      id: songId
    } as Song)));
  }

  public async update(songId: string, data: any): Promise<void> {
    await this.getSongRef(songId).update(data);
  }
}

