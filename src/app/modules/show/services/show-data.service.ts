import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {DbService} from '../../../services/db.service';
import {Show} from './show';

@Injectable({
  providedIn: 'root'
})
export class ShowDataService {
  constructor(private dbService: DbService) {
  }

  public list$ = (): Observable<Show[]> => this.dbService.col$('show');
  public read$ = (showId: string): Observable<Show | undefined> => this.dbService.doc$('show/' + showId);
  public update = async (showId: string, data: Partial<Show>): Promise<void> => await this.dbService.doc(showId).update(data);
  public add = async (data: Partial<Show>): Promise<string> => (await this.dbService.col('show').add(data)).id
}
