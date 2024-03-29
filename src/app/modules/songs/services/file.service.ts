import {Injectable} from '@angular/core';
import {AngularFireStorage} from '@angular/fire/compat/storage';
import {firstValueFrom, Observable} from 'rxjs';
import {FileDataService} from './file-data.service';

@Injectable({
  providedIn: 'root',
})
export class FileService {
  public constructor(private storage: AngularFireStorage, private fileDataService: FileDataService) {}

  public getDownloadUrl(path: string): Observable<string> {
    const ref = this.storage.ref(path);
    return ref.getDownloadURL() as Observable<string>;
  }

  public delete(path: string, songId: string, fileId: string): void {
    const ref = this.storage.ref(path);
    void firstValueFrom(ref.delete());
    void this.fileDataService.delete(songId, fileId);
  }
}
