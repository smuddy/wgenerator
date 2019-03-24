import { SongsService } from 'src/app/data/songs.service';
import {
  Component,
  ChangeDetectionStrategy,
  ChangeDetectorRef
} from '@angular/core';
import { faLongArrowAltLeft } from '@fortawesome/free-solid-svg-icons';
import { Song } from 'src/app/models/song.model';
import { DownloadService } from 'src/app/data/download.service';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-song',
  templateUrl: './song.component.html',
  styleUrls: ['./song.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('blend', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('700ms', style({ opacity: 0 })),
        animate('300ms', style({ opacity: 1 }))
      ]),
      transition(':leave', [
        style({ opacity: 1 }),
        animate('300ms', style({ opacity: 0 }))
      ])
    ])
  ]
})
export class SongComponent {
  public song: Song;
  public faArrow = faLongArrowAltLeft;
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

  public get text(): string[] {
    return this.song.Text.split(/\r?\n/).filter(_ => _ !== ' ');
  }
}
