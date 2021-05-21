import {Injectable} from '@angular/core';
import {Song} from './song';
import {Observable} from 'rxjs';
import {DbService} from '../../../services/db.service';

@Injectable({
  providedIn: 'root',
})
export class SongDataService {
  private collection = 'songs';

  public constructor(private dbService: DbService) {}

  public list$ = (): Observable<Song[]> => this.dbService.col$(this.collection);
  public read$ = (songId: string): Observable<Song | undefined> => this.dbService.doc$(this.collection + '/' + songId);
  public update$ = async (songId: string, data: Partial<Song>): Promise<void> => await this.dbService.doc(this.collection + '/' + songId).update(data);
  public add = async (data: Partial<Song>): Promise<string> => (await this.dbService.col(this.collection).add(data)).id;
  public delete = async (songId: string): Promise<void> => await this.dbService.doc(this.collection + '/' + songId).delete();
}
