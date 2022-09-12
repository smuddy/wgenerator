import {Component} from '@angular/core';
import {combineLatest, Observable} from 'rxjs';
import {PresentationBackground, Show} from '../../shows/services/show';
import {ShowSongService} from '../../shows/services/show-song.service';
import {SongService} from '../../songs/services/song.service';
import {Song} from '../../songs/services/song';
import {faDesktop} from '@fortawesome/free-solid-svg-icons';
import {ShowService} from '../../shows/services/show.service';
import {ShowSong} from '../../shows/services/show-song';
import {GlobalSettingsService} from '../../../services/global-settings.service';
import {UntypedFormControl} from '@angular/forms';
import {debounceTime, distinctUntilChanged, filter, map} from 'rxjs/operators';
import {fade} from '../../../animations';
import {delay} from '../../../services/delay';
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
})
export class RemoteComponent {
  public shows$: Observable<Show[]>;
  public show: Show | null = null;
  public showSongs: ShowSong[] = [];
  public songs: Song[] = [];
  public presentationSongs: PresentationSong[] = [];
  public currentShowId: string | null = null;
  public progress = false;

  public faDesktop = faDesktop;
  public showControl = new UntypedFormControl();

  public trackBy(index: number, item: PresentationSong): string {
    return item.id;
  }

  public constructor(
    private showService: ShowService,
    private showSongService: ShowSongService,
    private songService: SongService,
    private textRenderingService: TextRenderingService,
    private globalSettingsService: GlobalSettingsService
  ) {
    this.shows$ = showService
      .list$(true)
      .pipe(map(_ => _.filter(_ => _.date.toDate() > new Date(new Date().setMonth(new Date().getMonth() - 1))).sort((a, b) => (b.date < a.date ? -1 : b.date > a.date ? 1 : 0))));
    songService.list$().subscribe(_ => (this.songs = _));

    globalSettingsService.get$
      .pipe(
        filter(_ => !!_),
        map(_ => _ as GlobalSettings),
        map(_ => _.currentShow),
        distinctUntilChanged()
      )
      .subscribe(_ => {
        this.showControl.setValue(_, {emitEvent: false});
        void this.onShowChanged(_, false);
      });
    this.showControl.valueChanges.subscribe((value: string) => void this.onShowChanged(value));
  }

  public async onShowChanged(change: string, updateShow = true): Promise<void> {
    this.progress = true;
    if (updateShow) {
      await this.showService.update$(change, {presentationSongId: 'empty'});
      await delay(200);
      await this.globalSettingsService.set({currentShow: change});
      await this.showService.update$(change, {presentationSongId: 'title'});
    }
    this.currentShowId = change;
    this.showService
      .read$(change)
      .pipe(debounceTime(100))
      .subscribe(show => {
        this.show = show;
      });

    combineLatest([this.showService.read$(change), this.showSongService.list$(change)]).subscribe(([show, list]) => {
      this.showSongs = list;
      const presentationSongs = list.map(song => ({
        id: song.id,
        title: song.title,
        sections: this.textRenderingService.parse(song.text, null),
      }));
      this.presentationSongs = show?.order.map(_ => presentationSongs.filter(f => f.id === _)[0]) ?? [];
    });
    await delay(500);
    this.progress = false;
  }

  public getFirstLine(section: Section): string {
    return section.lines.filter(_ => _.type === 1)[0].text;
  }

  public async onSectionClick(id: string, index: number): Promise<void> {
    if (this.currentShowId != null)
      await this.showService.update$(this.currentShowId, {
        presentationSongId: id,
        presentationSection: index,
      });
  }

  public async onZoom(presentationZoom: number): Promise<void> {
    if (this.currentShowId != null) await this.showService.update$(this.currentShowId, {presentationZoom});
  }

  public async onBackground(presentationBackground: PresentationBackground): Promise<void> {
    if (this.currentShowId != null) await this.showService.update$(this.currentShowId, {presentationBackground});
  }
}
