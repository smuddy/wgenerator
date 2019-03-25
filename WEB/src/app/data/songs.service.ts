import { Injectable } from '@angular/core';
import { ODataService } from 'odata-v4-ng';
import { OdataService } from './odata.service';
import { Song } from '../models/song.model';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { State } from './state';

@Injectable({
  providedIn: 'root'
})
export class SongsService extends OdataService {
  public state = State.list;

  public songs: BehaviorSubject<Song[]> = new BehaviorSubject<Song[]>([]);
  public selectedSong: BehaviorSubject<Song> = new BehaviorSubject<Song>(null);

  constructor(odataService: ODataService) {
    super(odataService, 'songs');
  }

  public loadSongList(): void {
    const properties = ['ID', 'Name', 'Number', 'SongType', 'Key', 'Tempo'];
    this.list<Song>(properties).subscribe(_ => this.songs.next(_));
  }

  public selectSong(id: number): void {
    this.state = State.read;
    const filter = this.songs.value.filter(_ => _.ID === id);
    const song = filter.length === 1 ? filter[0] : null;
    if (!song) {
      return;
    }

    this.get<Song>(id, ['Text', 'Comments']).subscribe(_ => {
      song.Text = _.Text;
      song.Comments = _.Comments;
      this.selectedSong.next(song);
    });
  }

  public resetSelectedSong() {
    this.state = State.list;
    this.selectedSong.next(null);
  }

  public patch(id: number, control: string, value: any): Observable<boolean> {
    const patch = super.patch(id, control, value).pipe(
      tap(() => {
        const songs = this.songs.value;
        const song = songs.filter(_ => _.ID === id)[0];
        song[control] = value;
        this.songs.next(songs);
        this.selectedSong.next(song);
      })
    );
    return patch;
  }
}
