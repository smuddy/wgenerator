import {ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import {distinctUntilChanged, filter, map, shareReplay, switchMap, takeUntil, tap} from 'rxjs/operators';
import {ShowService} from '../../shows/services/show.service';
import {Song} from '../../songs/services/song';
import {GlobalSettingsService} from '../../../services/global-settings.service';
import {Config} from '../../../services/config';
import {Observable, Subject} from 'rxjs';
import {ConfigService} from '../../../services/config.service';
import {songSwitch} from '../../../widget-modules/components/song-text/animation';
import {PresentationBackground, Show} from '../../shows/services/show';
import {ShowSong} from '../../shows/services/show-song';
import {ShowSongService} from '../../shows/services/show-song.service';
import {openFullscreen} from '../../../services/fullscreen';
import {AsyncPipe, DatePipe} from '@angular/common';
import {LogoComponent} from './logo/logo.component';
import {SongTextComponent} from '../../../widget-modules/components/song-text/song-text.component';
import {LegalComponent} from './legal/legal.component';
import {ShowTypePipe} from '../../../widget-modules/pipes/show-type-translater/show-type.pipe';

@Component({
  selector: 'app-monitor',
  templateUrl: './monitor.component.html',
  styleUrls: ['./monitor.component.less'],
  animations: [songSwitch],
  imports: [LogoComponent, SongTextComponent, LegalComponent, AsyncPipe, DatePipe, ShowTypePipe],
})
export class MonitorComponent implements OnInit, OnDestroy {
  public song: Song | null = null;
  public zoom = 10;
  public currentShowId: string | null = null;
  public songId: string | null = null;
  public index: number | null = null;
  public showType: string | null = null;
  public presentationDynamicCaption: string | null = null;
  public presentationDynamicText: string | null = null;
  public date: Date | null = null;
  public config$: Observable<Config | null>;
  public presentationBackground: PresentationBackground = 'none';
  private destroy$ = new Subject<void>();

  public constructor(
    private showService: ShowService,
    private showSongService: ShowSongService,
    private globalSettingsService: GlobalSettingsService,
    private configService: ConfigService,
    private cRef: ChangeDetectorRef
  ) {
    this.config$ = configService.get$();
  }

  public ngOnInit(): void {
    openFullscreen();
    const currentShowId$ = this.globalSettingsService.get$.pipe(
      filter((settings): settings is NonNullable<typeof settings> => !!settings),
      map(settings => settings.currentShow),
      filter((showId): showId is string => !!showId),
      distinctUntilChanged(),
      tap(_ => (this.currentShowId = _)),
      takeUntil(this.destroy$)
    );

    const show$ = currentShowId$.pipe(
      switchMap(showId => this.showService.read$(showId)),
      filter((show): show is Show => !!show),
      shareReplay({
        bufferSize: 1,
        refCount: true,
      }),
      takeUntil(this.destroy$)
    );

    show$
      .pipe(
        tap(show => {
          this.showType = show.showType;
          this.date = show.date.toDate();
          this.index = show.presentationSection;
          this.presentationBackground = show.presentationBackground;
          this.presentationDynamicCaption = show.presentationDynamicCaption;
          this.presentationDynamicText = show.presentationDynamicText;
          this.zoom = show.presentationZoom ?? 30;
        }),
        takeUntil(this.destroy$)
      )
      .subscribe(() => this.cRef.markForCheck());

    show$
      .pipe(
        map(show => ({showId: show.id, presentationSongId: show.presentationSongId})),
        distinctUntilChanged((a, b) => a.showId === b.showId && a.presentationSongId === b.presentationSongId),
        tap(({presentationSongId}) => {
          if (presentationSongId === 'title' || presentationSongId === 'dynamicText' || !presentationSongId) {
            this.song = null;
          }
          if (this.songId !== presentationSongId) {
            this.songId = 'empty';
          }
          setTimeout(() => {
            this.songId = presentationSongId;
            this.cRef.markForCheck();
          }, 600);
        }),
        switchMap(({showId, presentationSongId}) => this.showSongService.read$(showId, presentationSongId)),
        filter((song): song is ShowSong => !!song),
        takeUntil(this.destroy$)
      )
      .subscribe(song => {
        this.song = song;
        this.cRef.markForCheck();
      });
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
