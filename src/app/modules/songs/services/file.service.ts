import {Injectable} from '@angular/core';
import {AngularFireStorage} from '@angular/fire/storage';
import {Observable} from 'rxjs';
import {FileDataService} from './file-data.service';

@Injectable({
  providedIn: 'root'
})
export class FileService {

  constructor(
    private storage: AngularFireStorage,
    private fileDataService: FileDataService
  ) {
  }

  public getDownloadUrl(path: string): Observable<string> {
    const ref = this.storage.ref(path);
    return ref.getDownloadURL();
  }

  public async delete(path: string, songId: string, fileId: string) {
    const ref = this.storage.ref(path);
    await ref.delete().toPromise()
    await this.fileDataService.delete(songId, fileId);
  }
}
