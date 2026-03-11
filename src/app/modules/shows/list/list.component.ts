import {Component, inject} from '@angular/core';
import {combineLatest} from 'rxjs';
import {Show} from '../services/show';
import {fade} from '../../../animations';
import {ShowService} from '../services/show.service';
import {FilterValues} from './filter/filter-values';
import {RouterLink} from '@angular/router';
import {map, switchMap} from 'rxjs/operators';
import {FilterStoreService} from '../../../services/filter-store.service';
import {RoleDirective} from '../../../services/user/role.directive';
import {ListHeaderComponent} from '../../../widget-modules/components/list-header/list-header.component';
import {AsyncPipe} from '@angular/common';
import {FilterComponent} from './filter/filter.component';
import {CardComponent} from '../../../widget-modules/components/card/card.component';
import {ListItemComponent} from './list-item/list-item.component';
import {SortByPipe} from '../../../widget-modules/pipes/sort-by/sort-by.pipe';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.less'],
  animations: [fade],
  imports: [RoleDirective, ListHeaderComponent, FilterComponent, CardComponent, ListItemComponent, RouterLink, AsyncPipe, SortByPipe],
})
export class ListComponent {
  private showService = inject(ShowService);
  private filterStore = inject(FilterStoreService);

  public filter$ = this.filterStore.showFilter$;
  public lastMonths$ = this.filter$.pipe(map((filterValues: FilterValues) => filterValues.time || 1));
  public owner$ = this.filter$.pipe(map((filterValues: FilterValues) => filterValues.owner));
  public showType$ = this.filter$.pipe(map((filterValues: FilterValues) => filterValues.showType));
  public shows$ = this.showService.list$();
  public privateShows$ = combineLatest([this.shows$, this.filter$]).pipe(
    map(([shows, filter]) => shows.filter(show => !show.published).filter(show => this.matchesPrivateFilter(show, filter)))
  );
  public queriedPublicShows$ = this.lastMonths$.pipe(switchMap(lastMonths => this.showService.listPublicSince$(lastMonths)));
  public fallbackPublicShows$ = combineLatest([this.shows$, this.lastMonths$]).pipe(
    map(([shows, lastMonths]) => {
      return shows.filter(show => show.published && !show.archived).filter(show => this.matchesTimeFilter(show, lastMonths));
    })
  );
  public publicShows$ = combineLatest([this.queriedPublicShows$, this.fallbackPublicShows$, this.owner$, this.showType$]).pipe(
    map(([queriedShows, fallbackShows, owner, showType]) => {
      const shows = queriedShows.length > 0 || fallbackShows.length === 0 ? queriedShows : fallbackShows;

      return shows.filter(show => !owner || show.owner === owner).filter(show => !showType || show.showType === showType);
    })
  );

  public trackBy = (index: number, show: unknown) => (show as Show).id;

  private matchesPrivateFilter(show: Show, filter: FilterValues): boolean {
    return this.matchesTimeFilter(show, filter.time || 1) && (!filter.showType || show.showType === filter.showType);
  }

  private matchesTimeFilter(show: Show, lastMonths: number): boolean {
    const startDate = new Date();
    startDate.setHours(0, 0, 0, 0);
    startDate.setDate(startDate.getDate() - lastMonths * 30);
    return show.date.toDate() >= startDate;
  }
}
