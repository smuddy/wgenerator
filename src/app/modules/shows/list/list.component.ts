import {Component} from '@angular/core';
import {combineLatest} from 'rxjs';
import {Show} from '../services/show';
import {fade} from '../../../animations';
import {ShowService} from '../services/show.service';
import {FilterValues} from './filter/filter-values';
import {ActivatedRoute, RouterLink} from '@angular/router';
import {map, switchMap} from 'rxjs/operators';
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
  public shows$ = this.showService.list$();
  public privateShows$ = this.showService.list$().pipe(map(show => show.filter(_ => !_.published)));
  public lastMonths$ = this.activatedRoute.queryParams.pipe(
    map(params => {
      const filterValues = params as FilterValues;
      if (!filterValues?.time) return 1;
      return +filterValues.time;
    })
  );
  public owner$ = this.activatedRoute.queryParams.pipe(
    map(params => {
      const filterValues = params as FilterValues;
      return filterValues?.owner;
    })
  );
  public showType$ = this.activatedRoute.queryParams.pipe(
    map(params => {
      const filterValues = params as FilterValues;
      return filterValues?.showType;
    })
  );
  public queriedPublicShows$ = this.lastMonths$.pipe(switchMap(lastMonths => this.showService.listPublicSince$(lastMonths)));

  public fallbackPublicShows$ = combineLatest([this.shows$, this.lastMonths$]).pipe(
    map(([shows, lastMonths]) => {
      const startDate = new Date();
      startDate.setHours(0, 0, 0, 0);
      startDate.setDate(startDate.getDate() - lastMonths * 30);

      return shows.filter(show => show.published && !show.archived && show.date.toDate() >= startDate);
    })
  );

  public publicShows$ = combineLatest([this.queriedPublicShows$, this.fallbackPublicShows$, this.owner$, this.showType$]).pipe(
    map(([queriedShows, fallbackShows, owner, showType]) => {
      const shows = queriedShows.length > 0 || fallbackShows.length === 0 ? queriedShows : fallbackShows;

      return shows.filter(show => !owner || show.owner === owner).filter(show => !showType || show.showType === showType);
    })
  );

  public constructor(
    private showService: ShowService,
    private activatedRoute: ActivatedRoute
  ) {}

  public trackBy = (index: number, show: unknown) => (show as Show).id;
}
