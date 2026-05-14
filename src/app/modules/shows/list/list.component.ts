import {Component, inject} from '@angular/core';
import {combineLatest} from 'rxjs';
import {Show} from '../services/show';
import {fade} from '../../../animations';
import {ShowService} from '../services/show.service';
import {FilterValues} from './filter/filter-values';
import {RouterLink} from '@angular/router';
import {map, switchMap} from 'rxjs/operators';
import {FilterStoreService} from '../../../services/filter-store.service';
import {AsyncPipe} from '@angular/common';
import {FilterComponent} from './filter/filter.component';
import {CardComponent} from '../../../widget-modules/components/card/card.component';
import {ListItemComponent} from './list-item/list-item.component';
import {UserService} from '../../../services/user/user.service';
import {PageFrameComponent} from '../../../widget-modules/components/sidebar/page-frame.component';
import {ButtonComponent} from '../../../widget-modules/components/button/button.component';
import {faPlus} from '@fortawesome/free-solid-svg-icons';
import {RoleDirective} from '../../../services/user/role.directive';

const DEFAULT_SHOW_FILTER: FilterValues = {
  time: 1,
  owner: '',
  showType: '',
  archived: false,
};

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.less'],
  animations: [fade],
  imports: [FilterComponent, CardComponent, ListItemComponent, RouterLink, AsyncPipe, PageFrameComponent, ButtonComponent, RoleDirective],
})
export class ListComponent {
  public faNewShow = faPlus;
  private filterStore = inject(FilterStoreService);
  public filter$ = this.filterStore.showFilter$;
  public filterActive$ = this.filter$.pipe(map(filter => this.isFilterActive(filter)));
  public lastMonths$ = this.filter$.pipe(map((filterValues: FilterValues) => filterValues.time || 1));
  public owner$ = this.filter$.pipe(map((filterValues: FilterValues) => filterValues.owner));
  public showType$ = this.filter$.pipe(map((filterValues: FilterValues) => filterValues.showType));
  public archived$ = this.filter$.pipe(map((filterValues: FilterValues) => !!filterValues.archived));
  private showService = inject(ShowService);
  public shows$ = this.showService.list$();
  public fallbackPublicShows$ = combineLatest([this.shows$, this.lastMonths$]).pipe(
    map(([shows, lastMonths]) => {
      return shows.filter(show => show.published && !show.archived).filter(show => this.matchesTimeFilter(show, lastMonths));
    }),
  );
  public ownShows$ = this.showService.list$(false, true);
  public queriedPublicShows$ = this.lastMonths$.pipe(switchMap(lastMonths => this.showService.listPublicSince$(lastMonths)));
  public publicShows$ = combineLatest([this.queriedPublicShows$, this.fallbackPublicShows$, this.owner$, this.showType$]).pipe(
    map(([queriedShows, fallbackShows, owner, showType]) => {
      const shows = queriedShows.length > 0 || fallbackShows.length === 0 ? queriedShows : fallbackShows;

      return this.sortShowsByDateDesc(shows.filter(show => !owner || show.owner === owner).filter(show => !showType || show.showType === showType));
    }),
  );
  private userService = inject(UserService);
  public privateShows$ = combineLatest([this.ownShows$, this.userService.user$, this.archived$]).pipe(
    map(([shows, user, showArchived]) =>
      shows.filter(show => {
        if (show.owner !== user?.id) {
          return false;
        }

        if (show.archived) {
          return showArchived;
        }

        return !show.published || show.reportedType === 'pending';
      }),
    ),
    map(shows => this.sortShowsByDateDesc(shows)),
  );
  public showSidebar$ = this.userService.user$.pipe(map(user => this.hasSidebarAccess(user?.role)));

  public trackBy = (index: number, show: unknown) => (show as Show).id;

  public resetFilter(): void {
    this.filterStore.resetShowFilter();
  }

  private matchesTimeFilter(show: Show, lastMonths: number): boolean {
    const startDate = new Date();
    startDate.setHours(0, 0, 0, 0);
    startDate.setDate(startDate.getDate() - lastMonths * 30);
    return show.date.toDate() >= startDate;
  }

  private sortShowsByDateDesc(shows: Show[]): Show[] {
    return [...shows].sort((left, right) => right.date.toDate().getTime() - left.date.toDate().getTime());
  }

  private hasSidebarAccess(role: string | null | undefined): boolean {
    if (!role) {
      return false;
    }

    const roles = role.split(';').map(item => item.trim());
    return roles.includes('admin') || roles.includes('leader');
  }

  private isFilterActive(filter: FilterValues): boolean {
    return (
      filter.time !== DEFAULT_SHOW_FILTER.time ||
      !!filter.owner ||
      !!filter.showType ||
      filter.archived !== DEFAULT_SHOW_FILTER.archived
    );
  }
}
