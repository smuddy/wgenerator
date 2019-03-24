import { SongsService } from 'src/app/data/songs.service';
import {
  Component,
  ChangeDetectionStrategy,
  ChangeDetectorRef
} from '@angular/core';
import { faLongArrowAltLeft, faEdit } from '@fortawesome/free-solid-svg-icons';
import { Song } from 'src/app/models/song.model';
import { DownloadService } from 'src/app/data/download.service';
import { blend } from 'src/app/services/animation';

@Component({
  selector: 'app-song',
  templateUrl: './song.component.html',
  styleUrls: ['./song.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [blend]
})
export class SongComponent {
  public song: Song;
  public faArrow = faLongArrowAltLeft;
  public faEdit = faEdit;
  public selectedSongId = 0;

  constructor(
    private songService: SongsService,
    private downloadService: DownloadService,
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
  public onBack(): void {
    this.songService.resetSelectedSong();
  }

  public onClickDownload(): void {
    const id = this.song.ID;
    this.downloadService.get(id, false);
  }

  public onClickEdit(): void {
    this.songService.edit = true;
  }

  public get text(): string[] {
    return this.song.Text.split(/\r?\n/).filter(_ => _ !== ' ');
  }
}
