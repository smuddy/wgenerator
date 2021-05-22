import {Injectable} from '@angular/core';
import {Upload} from './upload';
import {FileDataService} from './file-data.service';
import {AngularFireStorage} from '@angular/fire/storage';
import {finalize} from 'rxjs/operators';
import {FileBase} from './fileBase';
import {FileServer} from './fileServer';

@Injectable({
  providedIn: 'root',
})
export class UploadService extends FileBase {
  public constructor(private fileDataService: FileDataService, private angularFireStorage: AngularFireStorage) {
    super();
  }

  public pushUpload(songId: string, upload: Upload): void {
    const directory = this.directory(songId);
    const filePath = `${directory}/${upload.file.name}`;
    upload.path = directory;

    const ref = this.angularFireStorage.ref(filePath);
    const task = ref.put(upload.file);

    task.percentageChanges().subscribe(percent => (upload.progress = percent ?? 0));
    task
      .snapshotChanges()
      .pipe(finalize(() => void this.saveFileData(songId, upload)))
      .subscribe();
  }

  private async saveFileData(songId: string, upload: Upload) {
    const file: FileServer = {
      name: upload.file.name,
      path: upload.path,
      createdAt: new Date(),
    };
    await this.fileDataService.set(songId, file);
  }
}
