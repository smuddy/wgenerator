import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {Song} from '../models/song';
import {SongDataService} from './song-data.service';

@Injectable({
  providedIn: 'root'
})
export class SongService {

  public TYPES = ['Praise', 'Worship'];

  public KEYS = [
    'C', 'C#', 'Db', 'D', 'D#', 'Eb', 'E', 'F', 'F#', 'Gb', 'G', 'G#', 'Ab', 'A', 'A#', 'B', 'H',
    'c', 'c#', 'db', 'd', 'd#', 'eb', 'e', 'f', 'f#', 'gb', 'g', 'g#', 'ab', 'a', 'a#', 'b', 'h'
  ];

  constructor(private songDataService: SongDataService) {
  }

  public list$ = (): Observable<Song[]> => this.songDataService.list();
  public read = (songId: string): Observable<Song | undefined> => this.songDataService.read(songId);

  public async update(songId: string, data: any): Promise<void> {
    await this.songDataService.update(songId, data);
  }

}
