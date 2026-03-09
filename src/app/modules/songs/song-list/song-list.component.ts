import {ChangeDetectionStrategy, Component, OnDestroy, OnInit} from '@angular/core';
import {SongService} from '../services/song.service';
import {Song} from '../services/song';
import {map} from 'rxjs/operators';
import {combineLatest, Observable} from 'rxjs';
import {fade} from '../../../animations';
import {ActivatedRoute, RouterLink} from '@angular/router';
import {filterSong} from '../../../services/filter.helper';
import {FilterValues} from './filter/filter-values';
import {ScrollService} from '../../../services/scroll.service';
import {faBalanceScaleRight, faCheck, faPencilRuler} from '@fortawesome/free-solid-svg-icons';
import {AsyncPipe} from '@angular/common';
import {ListHeaderComponent} from '../../../widget-modules/components/list-header/list-header.component';
import {FilterComponent} from './filter/filter.component';
import {CardComponent} from '../../../widget-modules/components/card/card.component';
import {RoleDirective} from '../../../services/user/role.directive';
import {FaIconComponent} from '@fortawesome/angular-fontawesome';

@Component({
  selector: 'app-songs',
  templateUrl: './song-list.component.html',
  styleUrls: ['./song-list.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [fade],
  imports: [ListHeaderComponent, FilterComponent, CardComponent, RouterLink, RoleDirective, FaIconComponent, AsyncPipe],
})
export class SongListComponent implements OnInit, OnDestroy {
  public anyFilterActive = false;
  public songs$: Observable<Song[]> = combineLatest([
    this.activatedRoute.queryParams.pipe(map(_ => _ as FilterValues)),
    this.songService.list$().pipe(map(songs => [...songs].sort((a, b) => a.number - b.number))),
  ]).pipe(
    map(([filter, songs]) => {
      this.anyFilterActive = this.checkIfFilterActive(filter);
      return songs.filter(song => this.filter(song, filter)).sort((a, b) => a.title?.localeCompare(b.title));
    })
  );
  public faLegal = faBalanceScaleRight;
  public faDraft = faPencilRuler;
  public faFinal = faCheck;

  public constructor(
    private songService: SongService,
    private activatedRoute: ActivatedRoute,
    private scrollService: ScrollService
  ) {}

  public ngOnInit(): void {
    setTimeout(() => this.scrollService.restoreScrollPositionFor('songlist'), 100);
    setTimeout(() => this.scrollService.restoreScrollPositionFor('songlist'), 300);
  }

  public ngOnDestroy(): void {
    this.scrollService.storeScrollPositionFor('songlist');
  }

  public trackBy = (index: number, show: Song) => show.id;

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
}
