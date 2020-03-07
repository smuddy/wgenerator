import {Component} from '@angular/core';
import {Observable} from 'rxjs';
import {Show} from '../services/show';
import {ShowDataService} from '../services/show-data.service';
import {fade} from '../../../animations';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.less'],
  animations: [fade]
})
export class ListComponent {
  public shows$: Observable<Show[]>;

  constructor(showDataService: ShowDataService) {
    this.shows$ = showDataService.list$();
  }

}
