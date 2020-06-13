import {Component, OnInit} from '@angular/core';
import {distinctUntilChanged, map, switchMap, tap} from 'rxjs/operators';
import {ShowService} from '../../shows/services/show.service';
import {SongService} from '../../songs/services/song.service';
import {Section, TextRenderingService} from '../../songs/services/text-rendering.service';
import {Song} from '../../songs/services/song';
import {GlobalSettingsService} from '../../../services/global-settings.service';
import {Config} from '../../../services/config';
import {Observable} from 'rxjs';
import {ConfigService} from '../../../services/config.service';
import {songSwitch} from '../../../widget-modules/components/song-text/animation';

@Component({
  selector: 'app-monitor',
  templateUrl: './monitor.component.html',
  styleUrls: ['./monitor.component.less'],
  animations: [songSwitch]
})
export class MonitorComponent implements OnInit {
  public song: Song;
  public zoom: number;
  public currentShowId: string;
  public songId: string;
  public index: number;
  public showType: string;
  public date: Date;
  private sections: Section[];
  public config$: Observable<Config>;

  constructor(
    private showService: ShowService,
    private songService: SongService,
    private textRenderingService: TextRenderingService,
    private globalSettingsService: GlobalSettingsService,
    private configService: ConfigService,
  ) {
    this.config$ = configService.get$;
  }

  ngOnInit(): void {
    this.globalSettingsService.get$.pipe(
      map(_ => _.currentShow),
      distinctUntilChanged(),
      tap(_ => this.currentShowId = _),
      switchMap(_ => this.showService.read$(_)),
      tap(_ => this.showType = _.showType),
      tap(_ => this.date = _.date.toDate()),
      tap(_ => this.songId = _.presentationSongId),
      tap(_ => this.index = _.presentationSection),
      tap(_ => this.zoom = _.presentationZoom ?? 30),
      switchMap(_ => this.songService.read$(_.presentationSongId))
    ).subscribe((_: Song) => {
      this.song = _;
      this.sections = this.textRenderingService.parse(_.text, null);
    });
  }

}
