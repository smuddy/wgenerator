import { Injectable } from '@angular/core';
import { ODataService } from 'odata-v4-ng';
import { OdataService } from './odata.service';
import { Song } from '../models/song.model';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SongsService extends OdataService {
  public songs: BehaviorSubject<Song[]> = new BehaviorSubject<Song[]>([]);
  public selectedSong: BehaviorSubject<Song> = new BehaviorSubject<Song>(null);

  constructor(odataService: ODataService) {
    super(odataService, 'songs');
  }

  public loadSongList(): void {
    this.list<Song>().subscribe(_ => this.songs.next(_));
  }

  public selectSong(id: number): void {
    const filter = this.songs.value.filter(_ => _.ID === id);
    const song = filter.length === 1 ? filter[0] : null;
    this.selectedSong.next(song);
  }

  public resetSelectedSong() {
    this.selectedSong.next(null);
  }
}
