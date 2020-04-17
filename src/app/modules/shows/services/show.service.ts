import {Injectable} from '@angular/core';
import {ShowDataService} from './show-data.service';
import {Show} from './show';
import {Observable} from 'rxjs';
import {UserService} from '../../../services/user.service';
import {map, switchMap} from 'rxjs/operators';
import {User} from '../../../services/user';

@Injectable({
  providedIn: 'root'
})
export class ShowService {

  public static SHOW_TYPE = ['service-worship', 'service-praise', 'home-group-big', 'home-group', 'prayer-group', 'teens-group', 'kids-group', 'misc-public', 'misc-private'];
  public static SHOW_TYPE_PUBLIC = ['service-worship', 'service-praise', 'home-group-big', 'teens-group', 'kids-group', 'misc-public'];
  public static SHOW_TYPE_PRIVATE = ['home-group', 'prayer-group', 'misc-private',];
  private user: User;

  constructor(private showDataService: ShowDataService, private userService: UserService) {
    userService.user$.subscribe(_ => this.user = _);
  }

  public read$ = (showId: string): Observable<Show> => this.showDataService.read$(showId);

  public list$(publishedOnly: boolean = false): Observable<Show[]> {

    return this.userService.user$.pipe(
      switchMap(_ => this.showDataService.list$(), (user: User, shows: Show[]) => ({user, shows})),
      map(_ => _.shows
        .filter(_ => !_.archived)
        .filter(show => show.published || (show.owner === _.user.id && !publishedOnly))
      )
    )

  }

  public update$ = async (showId: string, data: Partial<Show>): Promise<void> => this.showDataService.update(showId, data);

  public async new$(data: Partial<Show>): Promise<string> {
    const calculatedData: Partial<Show> = {
      ...data,
      owner: this.user.id,
      public: ShowService.SHOW_TYPE_PUBLIC.indexOf(data.showType) !== -1,
    };
    return await this.showDataService.add(calculatedData);
  }
}
