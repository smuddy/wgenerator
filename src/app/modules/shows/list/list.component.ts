import {Component} from '@angular/core';
import {combineLatest} from 'rxjs';
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
  public shows$ = this.showService.list$();
  public privateShows$ = this.showService.list$().pipe(map(show => show.filter(_ => !_.published)));
  public lastMonths$ = this.activatedRoute.queryParams.pipe(
    map(params => {
      const filterValues = params as FilterValues;
      if (!filterValues?.time) return 1;
      return +filterValues.time;
    })
  );

  public publicShows$ = combineLatest([this.shows$, this.lastMonths$]).pipe(
    map(_ =>
      _[0].filter(f => {
        const d = new Date();
        d.setMonth(d.getMonth() - _[1]);
        return f.published && f.date.toDate() >= d;
      })
    )
  );

  public constructor(private showService: ShowService, private activatedRoute: ActivatedRoute) {}

  public trackBy = (index: number, show: unknown) => (show as Show).id;
}
