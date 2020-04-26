import {Component, OnInit} from '@angular/core';
import {filter, map, switchMap, tap} from 'rxjs/operators';
import {ActivatedRoute} from '@angular/router';
import {ShowService} from '../services/show.service';
import {Observable} from 'rxjs';
import {Show} from '../services/show';
import {SongService} from '../../songs/services/song.service';
import {Song} from '../../songs/services/song';
import {ShowSongService} from '../services/show-song.service';
import {ShowSong} from '../services/show-song';
import {DocxService} from '../services/docx.service';
import {faBox} from '@fortawesome/free-solid-svg-icons/faBox';
import {faBoxOpen} from '@fortawesome/free-solid-svg-icons/faBoxOpen';
import {faExternalLinkAlt} from '@fortawesome/free-solid-svg-icons/faExternalLinkAlt';
import {faLock} from '@fortawesome/free-solid-svg-icons/faLock';
import {faFileDownload} from '@fortawesome/free-solid-svg-icons/faFileDownload';

@Component({
  selector: 'app-show',
  templateUrl: './show.component.html',
  styleUrls: ['./show.component.less']
})
export class ShowComponent implements OnInit {
  public show$: Observable<Show>;
  public songs: Song[];
  public showSongs: ShowSong[];
  public showId: string;
  public showText: boolean;

  public faBox = faBox;
  public faBoxOpen = faBoxOpen;
  public faPublish = faExternalLinkAlt;
  public faUnpublish = faLock;
  public faDownload = faFileDownload;

  constructor(
    private activatedRoute: ActivatedRoute,
    private showService: ShowService,
    private songService: SongService,
    private showSongService: ShowSongService,
    private docxService: DocxService,
  ) {
  }

  ngOnInit(): void {
    this.show$ = this.activatedRoute.params.pipe(
      map(param => param.showId),
      tap(_ => this.showId = _),
      switchMap(showId => this.showService.read$(showId))
    );
    this.activatedRoute.params.pipe(
      map(param => param.showId),
      switchMap(showId => this.showSongService.list$(showId)),
      filter(_ => !!_)
    ).subscribe(_ => this.showSongs = _);
    this.songService.list$().pipe(
      filter(_ => !!_)
    ).subscribe(_ => this.songs = _);
  }

  public getSong(songId: string): Song {
    const filtered = this.songs.filter(_ => _.id === songId);
    return filtered.length > 0 ? filtered[0] : null;
  }

  public async onArchive(archived: boolean): Promise<void> {
    await this.showService.update$(this.showId, {archived});
  }

  public async onPublish(published: boolean): Promise<void> {
    await this.showService.update$(this.showId, {published});
  }

  public getStatus(show: Show): string {
    if (show.published) return 'veröffentlicht';
    if (show.reported) return 'gemeldet';
    return 'entwurf';
  }

  public async onDownload(): Promise<void> {
    await this.docxService.create(this.showId);
  }
}
