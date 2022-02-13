import {Component} from '@angular/core';
import {Observable} from 'rxjs';
import {Show} from '../services/show';
import {fade} from '../../../animations';
import {ShowService} from '../services/show.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.less'],
  animations: [fade],
})
export class ListComponent {
  public shows$: Observable<Show[]>;

  public constructor(showService: ShowService) {
    this.shows$ = showService.list$();
  }

  public getPublicShows(songs: Show[]): Show[] {
    return songs.filter(_ => _.published);
  }

  public getPrivateSongs(songs: Show[]): Show[] {
    return songs.filter(_ => !_.published);
  }

  public trackBy = (index: number, show: unknown) => (show as Show).id;
}
