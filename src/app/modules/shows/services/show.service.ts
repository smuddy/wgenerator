import {Injectable, inject} from '@angular/core';
import {ShowDataService} from './show-data.service';
import {Show} from './show';
import {firstValueFrom, Observable} from 'rxjs';
import {UserService} from '../../../services/user/user.service';
import {map, switchMap} from 'rxjs/operators';
import {User} from '../../../services/user/user';

@Injectable({
  providedIn: 'root',
})
export class ShowService {
  private showDataService = inject(ShowDataService);
  private userService = inject(UserService);

  public static SHOW_TYPE = ['service-worship', 'service-praise', 'home-group-big', 'home-group', 'prayer-group', 'teens-group', 'kids-group', 'misc-public', 'misc-private'];
  public static SHOW_TYPE_PUBLIC = ['service-worship', 'service-praise', 'home-group-big', 'teens-group', 'kids-group', 'misc-public'];
  public static SHOW_TYPE_PRIVATE = ['home-group', 'prayer-group', 'misc-private'];

  public read$ = (showId: string): Observable<Show | null> => this.showDataService.read$(showId);
  public listPublicSince$ = (lastMonths: number): Observable<Show[]> => this.showDataService.listPublicSince$(lastMonths);

  public list$(publishedOnly = false, includeOwnArchived = false): Observable<Show[]> {
    return this.userService.user$.pipe(
      switchMap(
        () => this.showDataService.list$,
        (user: User | null, shows: Show[]) => ({user, shows})
      ),
      map(s =>
        s.shows.filter(show => !show.archived || (includeOwnArchived && show.owner === s.user?.id)).filter(show => show.published || (show.owner === s.user?.id && !publishedOnly))
      )
    );
  }

  public update$ = async (showId: string, data: Partial<Show>): Promise<void> => this.showDataService.update(showId, data);

  public async new$(data: Partial<Show>): Promise<string | null> {
    const user = await firstValueFrom(this.userService.user$);
    if (!data.showType || !user) return null;
    const calculatedData: Partial<Show> = {
      ...data,
      owner: user.id,
      order: [],
      songIds: [],
      public: ShowService.SHOW_TYPE_PUBLIC.indexOf(data.showType) !== -1,
    };
    return await this.showDataService.add(calculatedData);
  }
}
