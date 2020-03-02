import {Component} from '@angular/core';
import {Upload} from '../../../services/upload';
import {UploadService} from '../../../services/upload.service';
import {ActivatedRoute} from '@angular/router';
import {map} from 'rxjs/operators';

@Component({
  selector: 'app-edit-file',
  templateUrl: './edit-file.component.html',
  styleUrls: ['./edit-file.component.less']
})
export class EditFileComponent {

  public selectedFiles: FileList;
  public currentUpload: Upload;
  public songId: string;

  constructor(private activatedRoute: ActivatedRoute, private uploadService: UploadService) {
    this.activatedRoute.params.pipe(
      map(param => param.songId),
    ).subscribe(songId => {
      this.songId = songId;
    });
  }

  detectFiles(event) {
    this.selectedFiles = event.target.files;
  }

  public async uploadSingle() {
    const file = this.selectedFiles.item(0);
    this.currentUpload = new Upload(file as any);
    await this.uploadService.pushUpload(this.songId, this.currentUpload);
  }

}
