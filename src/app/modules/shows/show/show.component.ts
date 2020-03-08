import {Component, OnInit} from '@angular/core';
import {map, switchMap} from 'rxjs/operators';
import {ActivatedRoute} from '@angular/router';
import {ShowService} from '../services/show.service';
import {Observable} from 'rxjs';
import {Show} from '../services/show';

@Component({
  selector: 'app-show',
  templateUrl: './show.component.html',
  styleUrls: ['./show.component.less']
})
export class ShowComponent implements OnInit {
  public show$: Observable<Show>;

  constructor(
    private activatedRoute: ActivatedRoute,
    private showService: ShowService
  ) {
  }

  ngOnInit(): void {
    this.show$ = this.activatedRoute.params.pipe(
      map(param => param.showId),
      switchMap(showId => this.showService.read$(showId))
    );
  }

}
