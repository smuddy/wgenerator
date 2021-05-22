import {Component, OnInit} from '@angular/core';
import {SongService} from '../songs/services/song.service';
import {GlobalSettingsService} from '../../services/global-settings.service';
import {Observable} from 'rxjs';
import {filter, map, switchMap} from 'rxjs/operators';
import {ShowSongService} from '../shows/services/show-song.service';
import {GlobalSettings} from '../../services/global-settings';
import {Song} from '../songs/services/song';

@Component({
  selector: 'app-guest',
  templateUrl: './guest.component.html',
  styleUrls: ['./guest.component.less'],
})
export class GuestComponent implements OnInit {
  public songs$: Observable<Observable<string>[]> | null = null;

  public constructor(
    private songService: SongService,
    private globalSettingsService: GlobalSettingsService,
    private showSongService: ShowSongService
  ) {}

  public ngOnInit(): void {
    this.songs$ = this.globalSettingsService.get$.pipe(
      filter(_ => !!_),
      map(_ => _ as GlobalSettings),
      map(_ => _.currentShow),
      switchMap(_ => this.showSongService.list$(_)),
      filter(_ => !!_),
      map(_ => _),
      map(_ =>
        _.sort((x, y) => x.order - y.order).map(showSong =>
          this.songService.read$(showSong.songId).pipe(
            filter(_ => !!_),
            map(_ => _ as Song),
            map(song => song.text)
          )
        )
      )
    );
  }
}
