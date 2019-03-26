import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Song } from 'src/app/models/song.model';
import { SongsService } from 'src/app/data/songs.service';
import { DownloadService } from 'src/app/data/download.service';
import { faFileUpload, faDownload } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-song-files',
  templateUrl: './song-files.component.html',
  styleUrls: ['./song-files.component.less']
})
export class SongFilesComponent {
  public song: Song;
  public selectedSongId = 0;
  public faFileUpload = faFileUpload;
  public faDownload = faDownload;
  public columns = ['name', 'action'];

  constructor(
    private downloadService: DownloadService,
    songService: SongsService,
    change: ChangeDetectorRef
  ) {
    songService.selectedSong.subscribe(_ => {
      if (_) {
        this.selectedSongId = _.ID;
        this.song = _;
      } else {
        this.selectedSongId = 0;
        this.song = null;
      }
      change.markForCheck();
    });
  }

  public onClickNew(): void {}
  public onClickDownload(id: number): void {}
}
