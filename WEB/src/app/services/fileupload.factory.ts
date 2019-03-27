import { base } from './../data/urls';
import { Injectable } from '@angular/core';
import { FileUploader } from 'ng2-file-upload';

@Injectable({
  providedIn: 'root'
})
export class FileuploadFactory {
  public provideForNewFiles(songId: number): FileUploader {
    const uploader = new FileUploader({
      url: base + '/api/songs/' + songId + '/files',
      autoUpload: true,
      isHTML5: true
    });

    return uploader;
  }
}
