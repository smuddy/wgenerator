import {Component, inject} from '@angular/core';
import {Upload} from '../../../services/upload';
import {UploadService} from '../../../services/upload.service';
import {ActivatedRoute} from '@angular/router';
import {map, switchMap} from 'rxjs/operators';
import {FileDataService} from '../../../services/file-data.service';
import {Observable} from 'rxjs';
import {File} from '../../../services/file';
import {CardComponent} from '../../../../../widget-modules/components/card/card.component';
import {AsyncPipe, NgStyle} from '@angular/common';
import {MatIconButton} from '@angular/material/button';
import {MatIcon} from '@angular/material/icon';
import {FileComponent} from './file/file.component';

@Component({
  selector: 'app-edit-file',
  templateUrl: './edit-file.component.html',
  styleUrls: ['./edit-file.component.less'],
  imports: [CardComponent, NgStyle, MatIconButton, MatIcon, FileComponent, AsyncPipe],
})
export class EditFileComponent {
  private activatedRoute = inject(ActivatedRoute);
  private uploadService = inject(UploadService);
  private fileService = inject(FileDataService);

  public selectedFiles: FileList | null = null;
  public currentUpload: Upload | null = null;
  public songId: string | null = null;
  public files$: Observable<File[]>;

  public constructor() {
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
