import {EnvironmentInjector, inject, Injectable, runInInjectionContext} from '@angular/core';
import {deleteObject, getDownloadURL, ref, Storage} from '@angular/fire/storage';
import {from, Observable} from 'rxjs';
import {FileDataService} from './file-data.service';

@Injectable({
  providedIn: 'root',
})
export class FileService {
  private storage = inject(Storage);
  private fileDataService = inject(FileDataService);
  private environmentInjector = inject(EnvironmentInjector);

  public getDownloadUrl(path: string): Observable<string> {
    return from(runInInjectionContext(this.environmentInjector, () => this.resolveDownloadUrl(path)));
  }

  public delete(path: string, songId: string, fileId: string): void {
    void runInInjectionContext(this.environmentInjector, () => this.deleteFromStorage(path));
    void this.fileDataService.delete(songId, fileId);
  }

  private resolveDownloadUrl(path: string): Promise<string> {
    return getDownloadURL(ref(this.storage, path));
  }

  private deleteFromStorage(path: string): Promise<void> {
    return deleteObject(ref(this.storage, path));
  }
}
