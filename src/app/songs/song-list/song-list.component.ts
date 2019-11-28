import {Component, OnInit} from '@angular/core';
import {SongService} from '../services/song.service';
import {Song} from '../models/song';
import {debounceTime, map} from 'rxjs/operators';
import {combineLatest, Observable} from 'rxjs';
import {fade} from '../../animations';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-songs',
  templateUrl: './song-list.component.html',
  styleUrls: ['./song-list.component.less'],
  animations: [fade]
})
export class SongListComponent implements OnInit {

  constructor(private songService: SongService, private activatedRoute: ActivatedRoute) {
  }
  public songs$: Observable<Song[]>;

  private static filter(song: Song, filterValue: string): boolean {
    if (!filterValue) {
      return true;
    }

    const textMatch = song.text && SongListComponent.normalize(song.text).indexOf(SongListComponent.normalize(filterValue)) !== -1;
    const titleMatch = song.title && SongListComponent.normalize(song.title).indexOf(SongListComponent.normalize(filterValue)) !== -1;

    return textMatch || titleMatch;
  }

  private static normalize(input: string): string {
    return input.toLowerCase().replace(/\s/g, '');
  }

  ngOnInit() {
    const filter$ = this.activatedRoute.queryParams.pipe(
      debounceTime(300),
      map(_ => _.q)
    );

    const songs$ = this.songService.list$().pipe(
      map(songs => songs.sort((a, b) => a.number - b.number)),
    );

    this.songs$ = combineLatest([filter$, songs$]).pipe(
      map(_ => _[1].filter(song => SongListComponent.filter(song, _[0])))
    );
  }
}
