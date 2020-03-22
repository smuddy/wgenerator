import {Injectable} from '@angular/core';
import {ShowSongDataService} from './show-song-data.service';
import {Observable} from 'rxjs';
import {ShowSong} from './showSong';
import {SongDataService} from '../../songs/services/song-data.service';
import {take} from 'rxjs/operators';
import {UserService} from '../../../services/user.service';

@Injectable({
  providedIn: 'root'
})
export class ShowSongService {

  constructor(
    private showSongDataService: ShowSongDataService,
    private songDataService: SongDataService,
    private userService: UserService,
  ) {
  }

  public async new$(showId: string, songId: string, order: number): Promise<string> {
    const song = await this.songDataService.read$(songId).pipe(take(1)).toPromise();
    const user = await this.userService.user$.pipe(take(1)).toPromise();
    const data: Partial<ShowSong> = {songId, order, key: song.key, keyOriginal: song.key, chordMode: user.chordMode};
    return await this.showSongDataService.add(showId, data);
  }

  public list$ = (showId: string): Observable<ShowSong[]> => this.showSongDataService.list$(showId, _ => _.orderBy('order'));
  public delete$ = (showId: string, songId: string): Promise<void> => this.showSongDataService.delete(showId, songId);
  public update$ = async (showId: string, songId: string, data: Partial<ShowSong>): Promise<void> => await this.showSongDataService.update$(showId, songId, data);
}
