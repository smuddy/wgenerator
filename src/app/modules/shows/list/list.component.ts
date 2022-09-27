import {Component} from '@angular/core';
import {combineLatest, Observable} from 'rxjs';
import {Show} from '../services/show';
import {fade} from '../../../animations';
import {ShowService} from '../services/show.service';
import {FilterValues} from './filter/filter-values';
import {ActivatedRoute} from '@angular/router';
import {map} from 'rxjs/operators';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.less'],
  animations: [fade],
})
export class ListComponent {
  public shows$: Observable<Show[]>;
  public publicShows$: Observable<Show[]>;
  public lastMonths$: Observable<number>;

  public constructor(showService: ShowService, activatedRoute: ActivatedRoute) {
    this.shows$ = showService.list$();
    this.lastMonths$ = activatedRoute.queryParams.pipe(
      map(params => {
        const filterValues = params as FilterValues;
        if (!filterValues?.time) return 3;
        return +filterValues.time;
      })
    );

    this.publicShows$ = combineLatest([this.shows$, this.lastMonths$]).pipe(
      map(_ =>
        _[0].filter(f => {
          const d = new Date();
          d.setMonth(d.getMonth() - _[1]);
          return f.published && f.date.toDate() >= d;
        })
      )
    );
  }

  public getPrivateSongs(songs: Show[]): Show[] {
    return songs.filter(_ => !_.published);
  }

  public trackBy = (index: number, show: unknown) => (show as Show).id;
}
