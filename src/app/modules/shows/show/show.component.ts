import {Component, OnInit} from '@angular/core';
import {filter, map, switchMap, tap} from 'rxjs/operators';
import {ActivatedRoute} from '@angular/router';
import {ShowService} from '../services/show.service';
import {Observable} from 'rxjs';
import {Show} from '../services/show';
import {SongService} from '../../songs/services/song.service';
import {Song} from '../../songs/services/song';
import {MatSelectChange} from '@angular/material/select';
import {ShowSongService} from '../services/show-song.service';
import {ShowSong} from '../services/showSong';

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

  constructor(
    private activatedRoute: ActivatedRoute,
    private showService: ShowService,
    private songService: SongService,
    private showSongService: ShowSongService,
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
      map(_ => _
        .filter(_ => !!_)
        .filter(_ => !!_.title)
        .filter(_ => _.title !== 'nicht gefunden')
        .filter(_ => _.title !== 'nicht vorhanden')
        .sort((a, b) => {
          if (a.title < b.title) {
            return -1;
          }
          if (a.title > b.title) {
            return 1;
          }
          return 0;
        })),
      filter(_ => !!_)
    ).subscribe(_ => this.songs = _);
  }

  public async onAddSongSelectionChanged(event: MatSelectChange) {
    await this.showSongService.new$(this.showId, event.value, this.showSongs.reduce((oa, u) => Math.max(oa, u.order), 0) + 1);
    event.source.value = null;
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
}
