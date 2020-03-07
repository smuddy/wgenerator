import {Injectable} from '@angular/core';
import {Song} from './song';
import {Observable} from 'rxjs';
import {DbService} from '../../../services/db.service';

@Injectable({
  providedIn: 'root'
})
export class SongDataService {
  constructor(private dbService: DbService) {
  }

  public list$ = (): Observable<Song[]> => this.dbService.col$('songs');
  public read$ = (songId: string): Observable<Song | undefined> => this.dbService.doc$('songs/' + songId);
  public update = async (songId: string, data: any): Promise<void> => await this.dbService.doc(songId).update(data);
}

