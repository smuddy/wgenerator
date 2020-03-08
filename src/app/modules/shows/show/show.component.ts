import {Component, OnInit} from '@angular/core';
import {map, switchMap, tap} from 'rxjs/operators';
import {ActivatedRoute} from '@angular/router';
import {ShowService} from '../services/show.service';
import {Observable} from 'rxjs';
import {Show} from '../services/show';
import {SongService} from '../../songs/services/song.service';
import {Song} from '../../songs/services/song';
import {MatSelectChange} from '@angular/material/select';
import {ShowSongService} from '../services/show-song.service';

@Component({
  selector: 'app-show',
  templateUrl: './show.component.html',
  styleUrls: ['./show.component.less']
})
export class ShowComponent implements OnInit {
  public show$: Observable<Show>;
  public songs$: Observable<Song[]>;
  private showId: string;

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
    this.songs$ = this.songService.list$().pipe(map(_ => _
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
      })));
  }

  public async onAddSongSelectionChanged(event: MatSelectChange) {
    await this.showSongService.new$(this.showId, event.value);
    event.source.value = null;
  }
}
