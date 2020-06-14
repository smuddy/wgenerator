import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {DbService} from '../../../services/db.service';
import {Show} from './show';

@Injectable({
  providedIn: 'root'
})
export class ShowDataService {
  private collection = 'shows';

  constructor(private dbService: DbService) {
  }

  public list$ = (queryFn?): Observable<Show[]> => this.dbService.col$(this.collection, queryFn);
  public read$ = (showId: string): Observable<Show | undefined> => this.dbService.doc$(`${this.collection}/${showId}`);
  public update = async (showId: string, data: Partial<Show>): Promise<void> => await this.dbService.doc(`${this.collection}/${showId}`).update(data);
  public add = async (data: Partial<Show>): Promise<string> => (await this.dbService.col(this.collection).add(data)).id;
}
