import {Injectable} from '@angular/core';
import {Upload} from './upload';
import {FileDataService} from './file-data.service';
import {ref, Storage, uploadBytesResumable} from '@angular/fire/storage';
import {FileBase} from './fileBase';
import {FileServer} from './fileServer';

@Injectable({
  providedIn: 'root',
})
export class UploadService extends FileBase {
  public constructor(
    private fileDataService: FileDataService,
    private storage: Storage
  ) {
    super();
  }

  public pushUpload(songId: string, upload: Upload): void {
    const directory = this.directory(songId);
    const filePath = `${directory}/${upload.file.name}`;
    upload.path = directory;

    const storageRef = ref(this.storage, filePath);
    const task = uploadBytesResumable(storageRef, upload.file);

    task.on(
      'state_changed',
      snapshot => {
        upload.progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      },
      () => {
        // Keep current UX: upload errors are ignored by this service.
      },
      () => void this.saveFileData(songId, upload)
    );
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
