import {Injectable} from '@angular/core';
import {File} from './file';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {FileServer} from './fileServer';
import {DbService} from '../../../services/db.service';

@Injectable({
  providedIn: 'root'
})
export class FileDataService {

  constructor(private db: DbService) {
  }

  public async set(songId: string, file: FileServer): Promise<string> {
    const songRef = this.db.doc('songs/' + songId);
    const fileCollection = songRef.collection('files');
    const id = await fileCollection.add(file);
    return id.id;
  }

  public read$(songId: string): Observable<File[]> {
    const songRef = this.db.doc('songs/' + songId);
    return songRef.collection<File>('files').snapshotChanges().pipe(map(actions => {
      return actions.map(a => ({
        ...a.payload.doc.data(),
        id: a.payload.doc.id
      }));
    }));
  }


}
