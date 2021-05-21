import {Injectable} from '@angular/core';
import {ShowSongDataService} from './show-song-data.service';
import {Observable} from 'rxjs';
import {ShowSong} from './show-song';
import {SongDataService} from '../../songs/services/song-data.service';
import {first, take} from 'rxjs/operators';
import {UserService} from '../../../services/user/user.service';

@Injectable({
  providedIn: 'root',
})
export class ShowSongService {
  public constructor(private showSongDataService: ShowSongDataService, private songDataService: SongDataService, private userService: UserService) {}

  public async new$(showId: string, songId: string, order: number, addedLive = false): Promise<string> {
    const song = await this.songDataService.read$(songId).pipe(take(1)).toPromise();
    const user = await this.userService.user$.pipe(take(1)).toPromise();
    const data: Partial<ShowSong> = {
      songId,
      order,
      key: song.key,
      keyOriginal: song.key,
      chordMode: user.chordMode,
      addedLive,
    };
    return await this.showSongDataService.add(showId, data);
  }

  public list$ = (showId: string): Observable<ShowSong[]> => this.showSongDataService.list$(showId, _ => _.orderBy('order'));
  public list = (showId: string): Promise<ShowSong[]> => this.list$(showId).pipe(first()).toPromise();
  public delete$ = (showId: string, songId: string): Promise<void> => this.showSongDataService.delete(showId, songId);
  public update$ = async (showId: string, songId: string, data: Partial<ShowSong>): Promise<void> => await this.showSongDataService.update$(showId, songId, data);
}
