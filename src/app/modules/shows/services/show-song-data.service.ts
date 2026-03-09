import {Injectable, inject} from '@angular/core';
import {DbService} from '../../../services/db.service';
import {Observable} from 'rxjs';
import {ShowSong} from './show-song';
import {QueryConstraint} from '@angular/fire/firestore';
import {shareReplay} from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ShowSongDataService {
  private dbService = inject(DbService);

  private collection = 'shows';
  private subCollection = 'songs';
  private listCache = new Map<string, Observable<ShowSong[]>>();

  public list$ = (showId: string, queryConstraints?: QueryConstraint[]): Observable<ShowSong[]> => {
    if (queryConstraints && queryConstraints.length > 0) {
      return this.dbService.col$(`${this.collection}/${showId}/${this.subCollection}`, queryConstraints);
    }

    const cached = this.listCache.get(showId);
    if (cached) {
      return cached;
    }

    const stream$ = this.dbService.col$<ShowSong>(`${this.collection}/${showId}/${this.subCollection}`).pipe(
      shareReplay({
        bufferSize: 1,
        refCount: true,
      })
    );

    this.listCache.set(showId, stream$);
    return stream$;
  };

  public read$ = (showId: string, songId: string): Observable<ShowSong | null> => this.dbService.doc$(`${this.collection}/${showId}/${this.subCollection}/${songId}`);
  public update$ = async (showId: string, songId: string, data: Partial<ShowSong>): Promise<void> =>
    await this.dbService.doc(`${this.collection}/${showId}/${this.subCollection}/${songId}`).update(data);
  public delete = async (showId: string, songId: string): Promise<void> => await this.dbService.doc(`${this.collection}/${showId}/${this.subCollection}/${songId}`).delete();
  public add = async (showId: string, data: Partial<ShowSong>): Promise<string> => (await this.dbService.col(`${this.collection}/${showId}/${this.subCollection}`).add(data)).id;
}
