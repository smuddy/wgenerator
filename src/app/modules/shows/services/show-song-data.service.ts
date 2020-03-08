import {Injectable} from '@angular/core';
import {DbService} from '../../../services/db.service';
import {Observable} from 'rxjs';
import {ShowSong} from './showSong';

@Injectable({
  providedIn: 'root'
})
export class ShowSongDataService {
  private collection = 'shows';
  private subCollection = 'songs';

  constructor(private dbService: DbService) {
  }

  public list$ = (showId: string, queryFn?): Observable<ShowSong[]> => this.dbService.col$(`${this.collection}/${showId}/${this.subCollection}`, queryFn);
  public read$ = (showId: string, songId: string): Observable<ShowSong | undefined> => this.dbService.doc$(`${this.collection}/${showId}/${this.subCollection}/${songId}`);
  public update$ = async (showId: string, songId: string, data: Partial<ShowSong>): Promise<void> => await this.dbService.doc(`${this.collection}/${showId}/${this.subCollection}/${songId}`).update(data);
  public delete = async (showId: string, songId: string): Promise<void> => await this.dbService.doc(`${this.collection}/${showId}/${this.subCollection}/${songId}`).delete();
  public add = async (showId: string, data: Partial<ShowSong>): Promise<string> => (await this.dbService.col(`${this.collection}/${showId}/${this.subCollection}`).add(data)).id
}
