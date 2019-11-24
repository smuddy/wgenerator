import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {Song} from '../models/song';
import {SongDataService} from './song-data.service';

@Injectable({
  providedIn: 'root'
})
export class SongService {

  constructor(private songDataService: SongDataService) {
  }

  public list = (): Observable<Song[]> => this.songDataService.list();
  public read = (songId: string): Observable<Song | undefined> => this.songDataService.read(songId);

}
