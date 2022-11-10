import {Injectable} from '@angular/core';
import {Song} from './song';
import {BehaviorSubject, Observable} from 'rxjs';
import {DbService} from '../../../services/db.service';
import {map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class SongDataService {
  private collection = 'songs';

  public constructor(private dbService: DbService) {
    this.dbService.col$<Song>(this.collection).subscribe(_ => this.list$.next(_));
  }

  public list$ = new BehaviorSubject<Song[]>([]);
  // public list$ = (): Observable<Song[]> => this.dbService.col$(this.collection);
  //public read$ = (songId: string): Observable<Song | null> => this.dbService.doc$(this.collection + '/' + songId);
  public read$ = (songId: string): Observable<Song | null> => this.list$.pipe(map(_ => _.find(s => s.id === songId) || null));
  public update$ = async (songId: string, data: Partial<Song>): Promise<void> => await this.dbService.doc(this.collection + '/' + songId).update(data);
  public add = async (data: Partial<Song>): Promise<string> => (await this.dbService.col(this.collection).add(data)).id;
  public delete = async (songId: string): Promise<void> => await this.dbService.doc(this.collection + '/' + songId).delete();
}
