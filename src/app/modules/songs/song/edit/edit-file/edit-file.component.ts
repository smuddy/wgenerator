import {Component} from '@angular/core';
import {Upload} from '../../../services/upload';
import {UploadService} from '../../../services/upload.service';
import {ActivatedRoute} from '@angular/router';
import {map, switchMap} from 'rxjs/operators';
import {FileDataService} from '../../../services/file-data.service';
import {Observable} from 'rxjs';
import {File} from '../../../services/file';

@Component({
  selector: 'app-edit-file',
  templateUrl: './edit-file.component.html',
  styleUrls: ['./edit-file.component.less'],
})
export class EditFileComponent {
  public selectedFiles: FileList | null = null;
  public currentUpload: Upload | null = null;
  public songId: string | null = null;
  public files$: Observable<File[]>;

  public constructor(
    private activatedRoute: ActivatedRoute,
    private uploadService: UploadService,
    private fileService: FileDataService
  ) {
    this.activatedRoute.params
      .pipe(
        map(param => param as {songId: string}),
        map(param => param.songId)
      )
      .subscribe(songId => {
        this.songId = songId;
      });

    this.files$ = this.activatedRoute.params.pipe(
      map(param => param as {songId: string}),
      map(param => param.songId),
      switchMap(songId => this.fileService.read$(songId))
    );
  }

  public detectFiles(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.selectedFiles = target.files;
  }

  public uploadSingle(): void {
    if (!this.selectedFiles || !this.songId) return;
    const file = this.selectedFiles.item(0);
    if (!file) return;
    this.currentUpload = new Upload(file);
    this.uploadService.pushUpload(this.songId, this.currentUpload);
  }
}
