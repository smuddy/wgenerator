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

@Component({
  selector: 'app-monitor',
  templateUrl: './monitor.component.html',
  styleUrls: ['./monitor.component.less']
})
export class MonitorComponent implements OnInit {
  public song: Song;
  public zoom: number;
  public index: number;
  private sections: Section[];
  private config$: Observable<Config>;

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
      switchMap(_ => this.showService.read$(_)),
      tap(_ => this.index = _.presentationSection),
      tap(_ => this.zoom = _.presentationZoom ?? 30),
      switchMap(_ => this.songService.read$(_.presentationSongId))
    ).subscribe(_ => {
      this.song = _;
      this.sections = this.textRenderingService.parse(_.text);
    });
  }

}
