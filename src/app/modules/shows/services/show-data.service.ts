import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {DbService} from '../../../services/db.service';
import {Show} from './show';
import {map, shareReplay} from 'rxjs/operators';
import {QueryFn} from '@angular/fire/compat/firestore/interfaces';
import firebase from 'firebase/compat/app';

@Injectable({
  providedIn: 'root',
})
export class ShowDataService {
  private collection = 'shows';
  public list$: Observable<Show[]> = this.dbService.col$<Show>(this.collection).pipe(
    // server-side ordering cuts client work and keeps stable order across subscribers
    map(shows => [...shows].sort((a, b) => a.date.toMillis() - b.date.toMillis())),
    shareReplay({
      bufferSize: 1,
      refCount: true,
    })
  );

  public constructor(private dbService: DbService) {}

  public listRaw$ = () => this.dbService.col$<Show>(this.collection);

  public listPublicSince$(lastMonths: number): Observable<Show[]> {
    const startDate = new Date();
    startDate.setHours(0, 0, 0, 0);
    startDate.setDate(startDate.getDate() - lastMonths * 30);
    const startTimestamp = firebase.firestore.Timestamp.fromDate(startDate);

    const queryFn: QueryFn = ref => ref.where('published', '==', true).where('date', '>=', startTimestamp).orderBy('date', 'desc');

    return this.dbService.col$<Show>(this.collection, queryFn).pipe(
      map(shows => shows.filter(show => !show.archived)),
      shareReplay({
        bufferSize: 1,
        refCount: true,
      })
    );
  }

  public read$ = (showId: string): Observable<Show | null> => this.dbService.doc$(`${this.collection}/${showId}`);

  public update = async (showId: string, data: Partial<Show>): Promise<void> => await this.dbService.doc(`${this.collection}/${showId}`).update(data);
  public add = async (data: Partial<Show>): Promise<string> => (await this.dbService.col(this.collection).add(data)).id;
}
