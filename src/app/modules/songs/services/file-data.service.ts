import {Injectable} from '@angular/core';
import {File} from './file';
import {Observable} from 'rxjs';
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

  public async delete(songId: string, fileId: string): Promise<void> {
    const fileRef = this.db.doc('songs/' + songId + '/files/' + fileId);
    await fileRef.delete();
  }

  public read$(songId: string): Observable<File[]> {
    const songRef = this.db.doc('songs/' + songId);
    return songRef.collection<File>('files').valueChanges({idField: 'id'});

  }


}
