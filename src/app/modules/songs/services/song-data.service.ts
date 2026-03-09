import {Injectable} from '@angular/core';
import {Song} from './song';
import {Observable} from 'rxjs';
import {DbService} from '../../../services/db.service';
import {shareReplay, startWith} from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class SongDataService {
  private collection = 'songs';
  public list$: Observable<Song[]> = this.dbService.col$<Song>(this.collection).pipe(
    startWith([] as Song[]), // immediate empty emit keeps UI responsive while first snapshot arrives
    shareReplay({
      bufferSize: 1,
      refCount: false, // keep the listener alive after first subscription to avoid reloading on navigation
    })
  );

  public constructor(private dbService: DbService) {
    // Warm the shared stream once at startup to avoid first-navigation delay.
    // this.list$.subscribe();
  }

  public read$ = (songId: string): Observable<Song | null> => this.dbService.doc$(this.collection + '/' + songId);
  public update$ = async (songId: string, data: Partial<Song>): Promise<void> => await this.dbService.doc(this.collection + '/' + songId).update(data);
  public add = async (data: Partial<Song>): Promise<string> => (await this.dbService.col(this.collection).add(data)).id;
  public delete = async (songId: string): Promise<void> => await this.dbService.doc(this.collection + '/' + songId).delete();
}
