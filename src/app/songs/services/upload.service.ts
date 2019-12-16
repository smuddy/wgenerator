import {Injectable} from '@angular/core';
import {Upload} from './upload';
import {FileDataService} from './file-data.service';
import {AngularFireStorage} from '@angular/fire/storage';
import {finalize} from 'rxjs/operators';
import {File} from './file';

@Injectable({
  providedIn: 'root'
})
export class UploadService {
  private basePath = '/attachments';

  constructor(private fileDataService: FileDataService, private angularFireStorage: AngularFireStorage) {
  }

  public async pushUpload(songId: string, upload: Upload) {
    const path = `${this.basePath}/${songId}`;
    const filePath = `${path}/${upload.file.name}`;
    upload.path = path;

    const ref = this.angularFireStorage.ref(filePath);
    const task = ref.put(upload.file);

    task.percentageChanges().subscribe(percent => upload.progress = percent);
    task.snapshotChanges().pipe(
      finalize(() => {
        this.saveFileData(songId, upload);
      })
    ).subscribe();

    // const storageRef = storage().ref();
    // const uploadTask = storageRef.child(`${this.basePath}/${songId}/${file.file.name}`).put(file.file as any);
    //
    // uploadTask.on(storage.TaskEvent.STATE_CHANGED,
    //   (snapshot) => {
    //     file.progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
    //   },
    //   (error) => {
    //     console.log(error);
    //   },
    //   () => {
    //     file.url = uploadTask.snapshot.downloadURL;
    //     file.name = file.file.name;
    //     this.saveFileData(songId, file);
    //   }
    // );
  }

  private async saveFileData(songId: string, upload: Upload) {
    const file: File = {
      name: upload.file.name,
      path: upload.path,
      createdAt: new Date()
    };
    await this.fileDataService.put(songId, file);
  }
}
