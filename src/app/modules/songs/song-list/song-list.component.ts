import {Component, OnInit} from '@angular/core';
import {SongService} from '../services/song.service';
import {Song} from '../services/song';
import {debounceTime, map} from 'rxjs/operators';
import {combineLatest, Observable} from 'rxjs';
import {fade} from '../../../animations';
import {ActivatedRoute} from '@angular/router';
import {filterSong} from '../../../services/filter.helper';
import {FilterValues} from './filter/filter-values';

@Component({
  selector: 'app-songs',
  templateUrl: './song-list.component.html',
  styleUrls: ['./song-list.component.less'],
  animations: [fade]
})
export class SongListComponent implements OnInit {

  public songs$: Observable<Song[]>;
  public anyFilterActive = false;

  constructor(private songService: SongService, private activatedRoute: ActivatedRoute) {
  }

  ngOnInit() {
    const filter$ = this.activatedRoute.queryParams.pipe(
      debounceTime(300),
      map(_ => _ as FilterValues)
    );

    const songs$ = this.songService.list$().pipe(
      map(songs => songs.sort((a, b) => a.number - b.number)),
    );

    this.songs$ = combineLatest([filter$, songs$]).pipe(
      map(_ => {
        let songs = _[1];
        let filter = _[0];
        this.anyFilterActive = this.checkIfFilterActive(filter);
        return songs.filter(song => this.filter(song, filter));
      })
    );

  }

  private filter(song: Song, filter: FilterValues): boolean {
    let baseFilter = filterSong(song, filter.q);
    baseFilter = baseFilter && (!filter.type || filter.type === song.type);
    baseFilter = baseFilter && (!filter.legalType || filter.legalType === song.legalType);
    baseFilter = baseFilter && (!filter.flag || this.checkFlag(filter.flag, song.flags));

    return baseFilter;
  }

  private checkIfFilterActive(filter: FilterValues): boolean {
    return !!filter.q || !!filter.type || !!filter.legalType || !!filter.flag;
  }

  private checkFlag(flag: string, flags: string) {
    if (!flags) return false;

    const flagStrings = flags.split(';');
    if (flagStrings.length === 0) return false;

    return flagStrings.indexOf(flag) !== -1;
  }
}
