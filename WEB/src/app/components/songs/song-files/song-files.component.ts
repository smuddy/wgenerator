import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Song } from 'src/app/models/song.model';
import { SongsService } from 'src/app/data/songs.service';
import { DownloadService } from 'src/app/data/download.service';
import { faFileUpload, faDownload, faEdit, faLongArrowAltLeft } from '@fortawesome/free-solid-svg-icons';
import { FileuploadFactory } from 'src/app/services/fileupload.factory';
import { FileUploader } from 'ng2-file-upload';

@Component({
  selector: 'app-song-files',
  templateUrl: './song-files.component.html',
  styleUrls: ['./song-files.component.less']
})
export class SongFilesComponent {
  public song: Song;
  public selectedSongId = 0;
  public faFileUpload = faFileUpload;
  public faArrow = faLongArrowAltLeft;
  public faDownload = faDownload;
  public faEdit = faEdit;
  public columns = ['name', 'action'];
  public newFileUploader: FileUploader;
  public fileEditId: number;

  public fileOverNew = false;

  constructor(
    private downloadService: DownloadService,
    private fileuploadFactory: FileuploadFactory,
    songService: SongsService,
    change: ChangeDetectorRef
  ) {
    songService.selectedSong.subscribe(_ => {
      if (_) {
        this.selectedSongId = _.ID;
        this.song = _;
        this.newFileUploader = this.fileuploadFactory.provideForNewFiles(_.ID);
        this.newFileUploader.onCompleteItem = () => songService.selectSong(_.ID);
        this.newFileUploader.onProgressItem = () => change.markForCheck;
      } else {
        this.selectedSongId = 0;
        this.song = null;
        this.newFileUploader = null;
      }
      change.markForCheck();
    });
  }

  public onClickDownload(fileId: number, filename): void {
    this.downloadService.get(this.selectedSongId, fileId, filename);
  }
  public onFileOverNew(hover: boolean) {
    this.fileOverNew = hover;
  }
  public onClickEdit(fileId: number) {
    this.fileEditId = fileId;
  }

}
