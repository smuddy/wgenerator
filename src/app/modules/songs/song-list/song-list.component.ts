import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {Song} from '../services/song';
import {map} from 'rxjs/operators';
import {combineLatest, Observable} from 'rxjs';
import {fade} from '../../../animations';
import {ActivatedRoute, RouterLink} from '@angular/router';
import {searchSongs} from '../../../services/filter.helper';
import {FilterValues} from './filter/filter-values';
import {faBalanceScaleRight, faCheck, faPencilRuler, faPlus} from '@fortawesome/free-solid-svg-icons';
import {TextRenderingService} from '../services/text-rendering.service';
import {FilterStoreService} from '../../../services/filter-store.service';
import {AsyncPipe} from '@angular/common';
import {FilterComponent} from './filter/filter.component';
import {CardComponent} from '../../../widget-modules/components/card/card.component';
import {RoleDirective} from '../../../services/user/role.directive';
import {FaIconComponent} from '@fortawesome/angular-fontawesome';
import {PageFrameComponent} from '../../../widget-modules/components/sidebar/page-frame.component';
import {ButtonComponent} from '../../../widget-modules/components/button/button.component';
import {matchesKeyFilter} from '../services/key.helper';

interface SongListItem extends Song {
  hasChordValidationIssues: boolean;
}

interface SongListViewModel {
  songs: SongListItem[];
  availableSongs: Song[];
  filterActive: boolean;
}

@Component({
  selector: 'app-songs',
  templateUrl: './song-list.component.html',
  styleUrls: ['./song-list.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [fade],
  imports: [FilterComponent, CardComponent, RouterLink, RoleDirective, FaIconComponent, AsyncPipe, PageFrameComponent, ButtonComponent],
})
export class SongListComponent {
  public faLegal = faBalanceScaleRight;
  public faDraft = faPencilRuler;
  public faFinal = faCheck;
  public faNewSong = faPlus;
  private route = inject(ActivatedRoute);
  private textRenderingService = inject(TextRenderingService);
  private filterStore = inject(FilterStoreService);
  public viewModel$: Observable<SongListViewModel> = combineLatest([
    this.filterStore.songFilter$,
    this.route.data.pipe(map(data => (data['songs'] as Song[]).slice().sort((a, b) => a.number - b.number))),
  ]).pipe(
    map(([filter, songs]) => {
      const filteredSongs = searchSongs(songs, filter.q)
        .filter(song => this.filter(song, filter))
        .map(song => ({
          ...song,
          hasChordValidationIssues: this.textRenderingService.validateChordNotation(song.text ?? '').length > 0,
        }));

      return {
        songs: filteredSongs,
        availableSongs: songs,
        filterActive: this.isFilterActive(filter),
      };
    }),
  );

  public trackBy = (index: number, show: SongListItem) => show.id;

  public resetFilter(): void {
    this.filterStore.resetSongFilter();
  }

  private filter(song: Song, filter: FilterValues): boolean {
    let baseFilter = !filter.type || filter.type === song.type;
    baseFilter =
      baseFilter &&
      matchesKeyFilter(song.key, {
        root: filter.keyRoot,
        mode: filter.keyMode,
        accidental: filter.keyAccidental,
        includeRelativeMinor: filter.includeRelativeMinor,
      });
    baseFilter = baseFilter && (!filter.legalType || filter.legalType === song.legalType);
    baseFilter = baseFilter && (!filter.flag || this.checkFlag(filter.flag, song.flags));

    return baseFilter;
  }

  private isFilterActive(filter: FilterValues): boolean {
    return !!(filter.q || filter.type || filter.keyRoot || filter.legalType || filter.flag);
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
