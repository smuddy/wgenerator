import {Component, OnInit} from '@angular/core';
import {distinctUntilChanged, filter, map, switchMap, tap} from 'rxjs/operators';
import {ShowService} from '../../shows/services/show.service';
import {SongService} from '../../songs/services/song.service';
import {Song} from '../../songs/services/song';
import {GlobalSettingsService} from '../../../services/global-settings.service';
import {Config} from '../../../services/config';
import {Observable} from 'rxjs';
import {ConfigService} from '../../../services/config.service';
import {songSwitch} from '../../../widget-modules/components/song-text/animation';
import {TextRenderingService} from '../../songs/services/text-rendering.service';
import {Show} from '../../shows/services/show';
import {GlobalSettings} from '../../../services/global-settings';
import {ShowSongService} from '../../shows/services/show-song.service';

@Component({
  selector: 'app-monitor',
  templateUrl: './monitor.component.html',
  styleUrls: ['./monitor.component.less'],
  animations: [songSwitch],
})
export class MonitorComponent implements OnInit {
  public song: Song | null = null;
  public zoom = 10;
  public currentShowId: string | null = null;
  public songId: string | null = null;
  public index: number | null = null;
  public showType: string | null = null;
  public date: Date | null = null;
  public config$: Observable<Config | null>;

  public constructor(
    private showService: ShowService,
    private showSongService: ShowSongService,
    private songService: SongService,
    private textRenderingService: TextRenderingService,
    private globalSettingsService: GlobalSettingsService,
    private configService: ConfigService
  ) {
    this.config$ = configService.get$;
  }

  public ngOnInit(): void {
    this.globalSettingsService.get$
      .pipe(
        filter(_ => !!_),
        map(_ => _ as GlobalSettings),
        map(_ => _.currentShow),
        distinctUntilChanged(),
        tap(_ => (this.currentShowId = _))
      )
      .pipe(
        switchMap(_ => this.showService.read$(_)),
        filter(_ => !!_),
        map(_ => _ as Show),
        tap<Show>(_ => (this.showType = _.showType)),
        tap<Show>(_ => (this.date = _.date.toDate())),
        tap<Show>(_ => (this.songId = _.presentationSongId)),
        tap<Show>(_ => (this.index = _.presentationSection)),
        tap<Show>(_ => (this.zoom = _.presentationZoom ?? 30))
      )
      .pipe(
        switchMap((_: Show) => this.showSongService.read$(_.id, _.presentationSongId)),
        filter(_ => !!_),
        map(_ => _ as Song)
      )
      .subscribe(_ => {
        this.song = _;
      });
  }
}
