import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {DbService} from '../../../services/db.service';
import {Show} from './show';
import {map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ShowDataService {
  private collection = 'shows';

  public constructor(private dbService: DbService) {
    this.dbService.col$<Show>(this.collection).subscribe(_ => this.list$.next(_));
  }

  public list$ = new BehaviorSubject<Show[]>([]);
  public read$ = (showId: string): Observable<Show | null> => this.list$.pipe(map(_ => _.find(s => s.id === showId) || null));

  // public list$ = (): Observable<Show[]> => this.dbService.col$(this.collection);
  // public read$ = (showId: string): Observable<Show | null> => this.dbService.doc$(`${this.collection}/${showId}`);
  public update = async (showId: string, data: Partial<Show>): Promise<void> => await this.dbService.doc(`${this.collection}/${showId}`).update(data);
  public add = async (data: Partial<Show>): Promise<string> => (await this.dbService.col(this.collection).add(data)).id;
}
