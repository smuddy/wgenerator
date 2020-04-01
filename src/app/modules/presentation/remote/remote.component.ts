import {Component} from '@angular/core';
import {ShowDataService} from '../../shows/services/show-data.service';
import {Observable} from 'rxjs';
import {Show} from '../../shows/services/show';
import {MatSelectChange} from '@angular/material/select';
import {ShowSongService} from '../../shows/services/show-song.service';
import {SongService} from '../../songs/services/song.service';
import {Song} from '../../songs/services/song';
import {Section, TextRenderingService} from '../../songs/services/text-rendering.service';
import {faSearchPlus} from '@fortawesome/free-solid-svg-icons/faSearchPlus';
import {faSearchMinus} from '@fortawesome/free-solid-svg-icons/faSearchMinus';
import {faDesktop} from '@fortawesome/free-solid-svg-icons/faDesktop';

export interface PresentationSong {
  id: string;
  title: string;
  sections: Section[];
}

@Component({
  selector: 'app-remote',
  templateUrl: './remote.component.html',
  styleUrls: ['./remote.component.less']
})
export class RemoteComponent {
  public shows$: Observable<Show[]>;
  public show: Show;
  public songs: Song[];
  public presentationSongs: PresentationSong[];
  public currentShowId: string;

  public faZoomIn = faSearchPlus;
  public faZoomOut = faSearchMinus;
  public faDesktop = faDesktop;

  constructor(
    private showDataService: ShowDataService,
    private showSongService: ShowSongService,
    private songService: SongService,
    private textRenderingService: TextRenderingService
  ) {
    this.shows$ = showDataService.list$();
    songService.list$().subscribe(_ => this.songs = _);
  }

  public onShowChanged(change: MatSelectChange): void {
    this.currentShowId = change.value;
    this.showDataService.read$(change.value).subscribe(_ => this.show = _);
    this.showSongService.list$(change.value).subscribe(_ => {
      this.presentationSongs = _
        .map(song => this.songs.filter(f => f.id == song.songId)[0])
        .map(song => ({
          id: song.id,
          title: song.title,
          sections: this.textRenderingService.parse(song.text)
        }))
    });
  }

  public getFirstLine(section: Section): string {
    return section.lines.filter(_ => _.type === 1)[0].text;
  }

  public async onSectionClick(id: string, index: number): Promise<void> {
    await this.showDataService.update(this.currentShowId, {
      presentationSongId: id,
      presentationSection: index
    })
  }

  public async onZoomIn() {
    debugger
    await this.showDataService.update(this.currentShowId, {
      presentationZoom: (this.show.presentationZoom ?? 30) + 2,
    });
  }

  public async onZoomOut() {
    await this.showDataService.update(this.currentShowId, {
      presentationZoom: (this.show.presentationZoom ?? 30) - 2,
    });
  }
}
