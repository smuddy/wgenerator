import {ChangeDetectionStrategy, ChangeDetectorRef, Component} from '@angular/core';
import {combineLatest, Subject} from 'rxjs';
import {PresentationBackground, Show} from '../../shows/services/show';
import {ShowSongService} from '../../shows/services/show-song.service';
import {SongService} from '../../songs/services/song.service';
import {faDesktop, faFolderOpen} from '@fortawesome/free-solid-svg-icons';
import {ShowService} from '../../shows/services/show.service';
import {ShowSong} from '../../shows/services/show-song';
import {GlobalSettingsService} from '../../../services/global-settings.service';
import {debounceTime, filter, map} from 'rxjs/operators';
import {fade} from '../../../animations';
import {TextRenderingService} from '../../songs/services/text-rendering.service';
import {Section} from '../../songs/services/section';
import {GlobalSettings} from '../../../services/global-settings';

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
})
export class RemoteComponent {
  public show: Show | null = null;
  public showSongs: ShowSong[] = [];
  public songs$ = this.songService.list$();
  public presentationSongs: PresentationSong[] = [];
  public progress = false;
  public faIcon = faFolderOpen;

  public faDesktop = faDesktop;

  public trackBy(index: number, item: PresentationSong): string {
    return item.id;
  }

  public presentationDynamicCaptionChanged$ = new Subject<{presentationDynamicCaption: string; showId: string}>();

  public onShowChanged(change: string): void {
    combineLatest([this.showService.read$(change), this.showSongService.list$(change)]).subscribe(([show, list]) => {
      this.showSongs = list;
      this.show = show;
      const presentationSongs = list.map(song => ({
        id: song.id,
        title: song.title,
        sections: this.textRenderingService.parse(song.text, null),
      }));
      this.presentationSongs = show?.order.map(_ => presentationSongs.filter(f => f.id === _)[0]) ?? [];
      this.cRef.markForCheck();
    });
  }

  public getFirstLine(section: Section): string {
    return section.lines.filter(_ => _.type === 1)[0].text;
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
  public presentationDynamicTextChanged$ = new Subject<{presentationDynamicText: string; showId: string}>();

  public constructor(
    private showService: ShowService,
    private showSongService: ShowSongService,
    private songService: SongService,
    private textRenderingService: TextRenderingService,
    private globalSettingsService: GlobalSettingsService,
    private cRef: ChangeDetectorRef
  ) {
    globalSettingsService.get$
      .pipe(
        filter(_ => !!_),
        map(_ => _ as GlobalSettings),
        map(_ => _.currentShow)
      )
      .subscribe(_ => {
        this.onShowChanged(_);
        this.cRef.markForCheck();
      });

    this.presentationDynamicCaptionChanged$
      .pipe(debounceTime(1000))
      .subscribe(_ => void this.showService.update$(_.showId, {presentationDynamicCaption: _.presentationDynamicCaption}));
    this.presentationDynamicTextChanged$.pipe(debounceTime(1000)).subscribe(_ => void this.showService.update$(_.showId, {presentationDynamicText: _.presentationDynamicText}));
  }

  public onDynamicCaption(presentationDynamicCaption: string, showId: string): void {
    this.presentationDynamicCaptionChanged$.next({presentationDynamicCaption, showId});
  }

  public onDynamicText(presentationDynamicText: string, showId: string): void {
    this.presentationDynamicTextChanged$.next({presentationDynamicText, showId});
  }
}
