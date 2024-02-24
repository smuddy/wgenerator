import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {DbService} from 'src/app/services/db.service';
import {GuestShow} from './guest-show';

@Injectable({
  providedIn: 'root',
})
export class GuestShowDataService {
  public list$: BehaviorSubject<GuestShow[]> = new BehaviorSubject<GuestShow[]>([]);
  private collection = 'guest';

  public constructor(private dbService: DbService) {
    this.dbService.col$<GuestShow>(this.collection).subscribe(_ => this.list$.next(_));
  }

  public read$: (id: string) => Observable<GuestShow | null> = (id: string): Observable<GuestShow | null> => this.list$.pipe(map(_ => _.find(s => s.id === id) || null));
  public update$: (id: string, data: Partial<GuestShow>) => Promise<void> = async (id: string, data: Partial<GuestShow>): Promise<void> =>
    await this.dbService.doc(this.collection + '/' + id).update(data);
  public add: (data: Partial<GuestShow>) => Promise<string> = async (data: Partial<GuestShow>): Promise<string> => (await this.dbService.col(this.collection).add(data)).id;
  public delete: (id: string) => Promise<void> = async (id: string): Promise<void> => await this.dbService.doc(this.collection + '/' + id).delete();
}
