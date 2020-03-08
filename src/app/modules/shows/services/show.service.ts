import {Injectable} from '@angular/core';
import {ShowDataService} from './show-data.service';
import {Show} from './show';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ShowService {

  public static SHOW_TYPE = ['service-worship', 'service-praise', 'home-group-big', 'home-group', 'prayer-group', 'teens-group', 'kids-group', 'misc-public', 'misc-private'];
  public static SHOW_TYPE_PUBLIC = ['service-worship', 'service-praise', 'home-group-big', 'teens-group', 'kids-group', 'misc-public'];
  public static SHOW_TYPE_PRIVATE = ['home-group', 'prayer-group', 'misc-private',];

  constructor(private showDataService: ShowDataService) {
  }

  public read$ = (showId: string): Observable<Show> => this.showDataService.read$(showId);

  public async new$(data: Partial<Show>): Promise<string> {
    const calculatedData: Partial<Show> = {
      ...data,
      public: ShowService.SHOW_TYPE_PUBLIC.indexOf(data.showType) !== -1,
    };
    return await this.showDataService.add(calculatedData);
  }
}
