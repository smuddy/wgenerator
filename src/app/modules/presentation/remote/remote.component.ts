import {Component} from '@angular/core';
import {Observable} from 'rxjs';
import {Show} from '../../shows/services/show';
import {ShowSongService} from '../../shows/services/show-song.service';
import {SongService} from '../../songs/services/song.service';
import {Song} from '../../songs/services/song';
import {Section, TextRenderingService} from '../../songs/services/text-rendering.service';
import {faDesktop} from '@fortawesome/free-solid-svg-icons/faDesktop';
import {ShowService} from '../../shows/services/show.service';
import {ShowSong} from '../../shows/services/show-song';
import {GlobalSettingsService} from '../../../services/global-settings.service';
import {FormControl} from '@angular/forms';
import {distinctUntilChanged, map} from 'rxjs/operators';
import {fade} from '../../../animations';
import {delay} from '../../../services/delay';

export interface PresentationSong {
  id: string;
  title: string;
  sections: Section[];
}

@Component({
  selector: 'app-remote',
  templateUrl: './remote.component.html',
  styleUrls: ['./remote.component.less'],
  animations: [fade]
})
export class RemoteComponent {
  public shows$: Observable<Show[]>;
  public show: Show;
  public showSongs: ShowSong[];
  public songs: Song[];
  public presentationSongs: PresentationSong[];
  public currentShowId: string;
  public progress = false;

  public faDesktop = faDesktop;
  public showControl = new FormControl();

  constructor(
    private showService: ShowService,
    private showSongService: ShowSongService,
    private songService: SongService,
    private textRenderingService: TextRenderingService,
    private globalSettingsService: GlobalSettingsService,
  ) {
    this.shows$ = showService.list$(true);
    songService.list$().subscribe(_ => this.songs = _);

    globalSettingsService.get$.pipe(
      map(_ => _.currentShow),
      distinctUntilChanged()
    ).subscribe(_ => {
      this.showControl.setValue(_, {emitEvent: false});
      this.onShowChanged(_, false);
    });
    this.showControl.valueChanges.subscribe(value => this.onShowChanged(value));
  }

  public async onShowChanged(change: string, updateShow = true): Promise<void> {
    this.progress = true;
    if (updateShow) {
      await this.showService.update$(change, {presentationSongId: 'empty'});
      await delay(1200);
      await this.globalSettingsService.set({currentShow: change});
      await this.showService.update$(change, {presentationSongId: 'title'});
    }
    this.currentShowId = change;
    this.showService.read$(change).subscribe(_ => this.show = _);
    this.showSongService.list$(change).subscribe(_ => {
      this.showSongs = _;
      this.presentationSongs = _
        .map(song => this.songs.filter(f => f.id == song.songId)[0])
        .map(song => ({
          id: song.id,
          title: song.title,
          sections: this.textRenderingService.parse(song.text)
        }))
    });
    await delay(500);
    this.progress = false;
  }

  public getFirstLine(section: Section): string {
    return section.lines.filter(_ => _.type === 1)[0].text;
  }

  public async onSectionClick(id: string, index: number): Promise<void> {
    await this.showService.update$(this.currentShowId, {
      presentationSongId: id,
      presentationSection: index
    })
  }

  public async onZoom(zoom: number) {
    await this.showService.update$(this.currentShowId, {
      presentationZoom: zoom,
    });
  }
}
