import {Component, OnInit} from '@angular/core';
import {SongService} from '../services/song.service';
import {Song} from '../services/song';
import {debounceTime, map} from 'rxjs/operators';
import {combineLatest, Observable} from 'rxjs';
import {fade} from '../../../animations';
import {ActivatedRoute} from '@angular/router';
import {filterSong} from '../../../services/filter.helper';

@Component({
  selector: 'app-songs',
  templateUrl: './song-list.component.html',
  styleUrls: ['./song-list.component.less'],
  animations: [fade]
})
export class SongListComponent implements OnInit {

  public songs$: Observable<Song[]>;

  constructor(private songService: SongService, private activatedRoute: ActivatedRoute) {
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
      map(_ => _[1].filter(song => filterSong(song, _[0])))
    );
  }
}
