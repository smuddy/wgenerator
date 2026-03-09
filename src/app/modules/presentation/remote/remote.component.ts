import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy} from '@angular/core';
import {combineLatest, Subject} from 'rxjs';
import {PresentationBackground, Show} from '../../shows/services/show';
import {ShowSongService} from '../../shows/services/show-song.service';
import {SongService} from '../../songs/services/song.service';
import {faDesktop, faFolderOpen} from '@fortawesome/free-solid-svg-icons';
import {ShowService} from '../../shows/services/show.service';
import {ShowSong} from '../../shows/services/show-song';
import {GlobalSettingsService} from '../../../services/global-settings.service';
import {debounceTime, distinctUntilChanged, filter, map, switchMap, takeUntil} from 'rxjs/operators';
import {fade} from '../../../animations';
import {TextRenderingService} from '../../songs/services/text-rendering.service';
import {Section} from '../../songs/services/section';
import {LineType} from '../../songs/services/line-type';
import {AsyncPipe, DatePipe, NgFor, NgIf} from '@angular/common';
import {CardComponent} from '../../../widget-modules/components/card/card.component';
import {MatFormField, MatLabel} from '@angular/material/form-field';
import {MatInput} from '@angular/material/input';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatButton} from '@angular/material/button';
import {RouterLink} from '@angular/router';
import {FaIconComponent} from '@fortawesome/angular-fontawesome';
import {MatSelect} from '@angular/material/select';
import {MatOption} from '@angular/material/core';
import {MatSlider, MatSliderThumb} from '@angular/material/slider';
import {AddSongComponent} from '../../../widget-modules/components/add-song/add-song.component';
import {ShowTypePipe} from '../../../widget-modules/pipes/show-type-translater/show-type.pipe';
import {SectionTypePipe} from '../../../widget-modules/pipes/section-type-translator/section-type.pipe';

export interface PresentationSong {
  id: string;
  title: string;
  sections: Section[];
}

@Component({
  selector: 'app-remote',
  templateUrl: './remote.component.html',
  styleUrls: ['./remote.component.less'],
  animations: [fade],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    NgIf,
    CardComponent,
    NgFor,
    MatFormField,
    MatLabel,
    MatInput,
    ReactiveFormsModule,
    FormsModule,
    MatButton,
    RouterLink,
    FaIconComponent,
    MatSelect,
    MatOption,
    MatSlider,
    MatSliderThumb,
    AddSongComponent,
    AsyncPipe,
    DatePipe,
    ShowTypePipe,
    SectionTypePipe,
  ],
})
export class RemoteComponent implements OnDestroy {
  public show: Show | null = null;
  public showSongs: ShowSong[] = [];
  public songs$ = this.songService.list$();
  public presentationSongs: PresentationSong[] = [];
  public progress = false;
  public faIcon = faFolderOpen;

  public faDesktop = faDesktop;
  public presentationDynamicCaptionChanged$ = new Subject<{presentationDynamicCaption: string; showId: string}>();
  public presentationDynamicTextChanged$ = new Subject<{presentationDynamicText: string; showId: string}>();
  private destroy$ = new Subject<void>();

  public constructor(
    private showService: ShowService,
    private showSongService: ShowSongService,
    private songService: SongService,
    private textRenderingService: TextRenderingService,
    globalSettingsService: GlobalSettingsService,
    private cRef: ChangeDetectorRef
  ) {
    globalSettingsService.get$
      .pipe(
        filter((settings): settings is NonNullable<typeof settings> => !!settings),
        map(_ => _.currentShow),
        filter((showId): showId is string => !!showId),
        distinctUntilChanged(),
        switchMap(showId =>
          combineLatest([this.showService.read$(showId), this.showSongService.list$(showId)]).pipe(
            map(([show, list]) => {
              const presentationSongs = list.map(song => ({
                id: song.id,
                title: song.title,
                sections: this.textRenderingService.parse(song.text, null, false),
              }));
              return {show, list, presentationSongs};
            })
          )
        ),
        takeUntil(this.destroy$)
      )
      .subscribe(({show, list, presentationSongs}) => {
        this.showSongs = list;
        this.show = show;
        const order = show?.order ?? [];
        const presentationSongsById = new Map(presentationSongs.map(song => [song.id, song] as const));
        this.presentationSongs = order.map(id => presentationSongsById.get(id) ?? null).filter((s): s is PresentationSong => !!s);
        this.cRef.markForCheck();
      });

    this.presentationDynamicCaptionChanged$
      .pipe(debounceTime(1000))
      .subscribe(_ => void this.showService.update$(_.showId, {presentationDynamicCaption: _.presentationDynamicCaption}));
    this.presentationDynamicTextChanged$.pipe(debounceTime(1000)).subscribe(_ => void this.showService.update$(_.showId, {presentationDynamicText: _.presentationDynamicText}));
  }

  public trackBy(index: number, item: PresentationSong): string {
    return item.id;
  }

  public getFirstLine(section: Section): string {
    return section.lines.filter(_ => _.type === LineType.text)[0].text;
  }

  public async onSectionClick(id: string, index: number, showId: string): Promise<void> {
    await this.showService.update$(showId, {
      presentationSongId: id,
      presentationSection: index,
    });
  }

  public async onZoom(presentationZoom: number, showId: string): Promise<void> {
    await this.showService.update$(showId, {presentationZoom});
  }

  public async onBackground(presentationBackground: PresentationBackground, showId: string): Promise<void> {
    await this.showService.update$(showId, {presentationBackground});
  }

  public onDynamicCaption(presentationDynamicCaption: string, showId: string): void {
    this.presentationDynamicCaptionChanged$.next({presentationDynamicCaption, showId});
  }

  public onDynamicText(presentationDynamicText: string, showId: string): void {
    this.presentationDynamicTextChanged$.next({presentationDynamicText, showId});
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
