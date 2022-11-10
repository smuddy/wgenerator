import {ChangeDetectionStrategy, Component, OnDestroy, OnInit} from '@angular/core';
import {SongService} from '../services/song.service';
import {Song} from '../services/song';
import {map} from 'rxjs/operators';
import {combineLatest, Observable} from 'rxjs';
import {fade} from '../../../animations';
import {ActivatedRoute} from '@angular/router';
import {filterSong} from '../../../services/filter.helper';
import {FilterValues} from './filter/filter-values';
import {ScrollService} from '../../../services/scroll.service';
import {faBalanceScaleRight, faCheck, faPencilRuler} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-songs',
  templateUrl: './song-list.component.html',
  styleUrls: ['./song-list.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [fade],
})
export class SongListComponent implements OnInit, OnDestroy {
  public songs$: Observable<Song[]> | null = combineLatest([
    this.activatedRoute.queryParams.pipe(map(_ => _ as FilterValues)),
    this.songService.list$().pipe(map(songs => songs.sort((a, b) => a.number - b.number))),
  ]).pipe(
    map(_ => {
      const songs = _[1];
      const filter = _[0];
      this.anyFilterActive = this.checkIfFilterActive(filter);
      return songs.filter(song => this.filter(song, filter));
    })
  );
  public anyFilterActive = false;
  public faLegal = faBalanceScaleRight;
  public faDraft = faPencilRuler;
  public faFinal = faCheck;

  public constructor(private songService: SongService, private activatedRoute: ActivatedRoute, private scrollService: ScrollService) {}

  public ngOnInit(): void {
    setTimeout(() => this.scrollService.restoreScrollPositionFor('songlist'), 100);
    setTimeout(() => this.scrollService.restoreScrollPositionFor('songlist'), 300);
  }

  public ngOnDestroy(): void {
    this.scrollService.storeScrollPositionFor('songlist');
  }

  private filter(song: Song, filter: FilterValues): boolean {
    let baseFilter = filterSong(song, filter.q);
    baseFilter = baseFilter && (!filter.type || filter.type === song.type);
    baseFilter = baseFilter && (!filter.key || filter.key === song.key);
    baseFilter = baseFilter && (!filter.legalType || filter.legalType === song.legalType);
    baseFilter = baseFilter && (!filter.flag || this.checkFlag(filter.flag, song.flags));

    return baseFilter;
  }

  private checkIfFilterActive(filter: FilterValues): boolean {
    return !!filter.q || !!filter.type || !!filter.key || !!filter.legalType || !!filter.flag;
  }

  private checkFlag(flag: string, flags: string) {
    if (!flags) {
      return false;
    }

    const flagStrings = flags.split(';');
    if (flagStrings.length === 0) {
      return false;
    }

    return flagStrings.indexOf(flag) !== -1;
  }

  public trackBy = (index: number, show: Song) => show.id;
}
