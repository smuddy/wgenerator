import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {shareReplay} from 'rxjs/operators';
import {DbService} from 'src/app/services/db.service';
import {GuestShow} from './guest-show';

@Injectable({
  providedIn: 'root',
})
export class GuestShowDataService {
  private collection = 'guest';
  public list$: Observable<GuestShow[]> = this.dbService.col$<GuestShow>(this.collection).pipe(
    shareReplay({
      bufferSize: 1,
      refCount: true,
    })
  );

  public constructor(private dbService: DbService) {}

  public read$: (id: string) => Observable<GuestShow | null> = (id: string): Observable<GuestShow | null> => this.dbService.doc$(`${this.collection}/${id}`);
  public update$: (id: string, data: Partial<GuestShow>) => Promise<void> = async (id: string, data: Partial<GuestShow>): Promise<void> =>
    await this.dbService.doc(this.collection + '/' + id).update(data);
  public add: (data: Partial<GuestShow>) => Promise<string> = async (data: Partial<GuestShow>): Promise<string> => (await this.dbService.col(this.collection).add(data)).id;
  public delete: (id: string) => Promise<void> = async (id: string): Promise<void> => await this.dbService.doc(this.collection + '/' + id).delete();
}
