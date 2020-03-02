import {Injectable} from '@angular/core';
import {SongDataService} from './song-data.service';
import {File} from './file';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {FileServer} from './fileServer';

@Injectable({
  providedIn: 'root'
})
export class FileDataService {

  constructor(private songDataService: SongDataService) {
  }

  public async put(songId: string, file: FileServer): Promise<string> {
    const songRef = this.songDataService.getSongRef(songId);
    const fileCollection = songRef.collection('files');
    const id = await fileCollection.add(file);
    return id.id;
  }

  public get$(songId: string): Observable<File[]> {
    const songRef = this.songDataService.getSongRef(songId);
    return songRef.collection<File>('files').snapshotChanges().pipe(map(actions => {
      return actions.map(a => ({
        ...a.payload.doc.data(),
        id: a.payload.doc.id
      }));
    }));
  }


}
