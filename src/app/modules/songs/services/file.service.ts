import {Injectable, inject} from '@angular/core';
import {deleteObject, getDownloadURL, ref, Storage} from '@angular/fire/storage';
import {from, Observable} from 'rxjs';
import {FileDataService} from './file-data.service';

@Injectable({
  providedIn: 'root',
})
export class FileService {
  private storage = inject(Storage);
  private fileDataService = inject(FileDataService);

  public getDownloadUrl(path: string): Observable<string> {
    return from(getDownloadURL(ref(this.storage, path)));
  }

  public delete(path: string, songId: string, fileId: string): void {
    void deleteObject(ref(this.storage, path));
    void this.fileDataService.delete(songId, fileId);
  }
}
