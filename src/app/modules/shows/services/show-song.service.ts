import {Injectable} from '@angular/core';
import {ShowSongDataService} from './show-song-data.service';
import {Observable} from 'rxjs';
import {ShowSong} from './show-song';
import {SongDataService} from '../../songs/services/song-data.service';
import {first, take} from 'rxjs/operators';
import {UserService} from '../../../services/user/user.service';
import {ShowService} from './show.service';

@Injectable({
  providedIn: 'root',
})
export class ShowSongService {
  public constructor(
    private showSongDataService: ShowSongDataService,
    private songDataService: SongDataService,
    private userService: UserService,
    private showService: ShowService
  ) {}

  public async new$(showId: string, songId: string, addedLive = false): Promise<string | null> {
    const song = await this.songDataService.read$(songId).pipe(take(1)).toPromise();
    const user = await this.userService.user$.pipe(take(1)).toPromise();
    if (!song || !user) return null;
    const data: Partial<ShowSong> = {
      ...song,
      songId,
      key: song.key,
      keyOriginal: song.key,
      chordMode: user.chordMode,
      addedLive,
    };
    return await this.showSongDataService.add(showId, data);
  }

  public read$ = (showId: string, songId: string): Observable<ShowSong | null> => this.showSongDataService.read$(showId, songId);
  public read = (showId: string, songId: string): Promise<ShowSong | null> => this.read$(showId, songId).pipe(first()).toPromise();

  public list$ = (showId: string): Observable<ShowSong[]> => this.showSongDataService.list$(showId);
  public list = (showId: string): Promise<ShowSong[]> => this.list$(showId).pipe(first()).toPromise();

  public async delete$(showId: string, songId: string, index: number): Promise<void> {
    await this.showSongDataService.delete(showId, songId);
    const show = await this.showService.read$(showId).pipe(first()).toPromise();
    if (!show) return;
    const order = show.order;
    order.splice(index, 1);
    await this.showService.update$(showId, {order});
  }

  public update$ = async (showId: string, songId: string, data: Partial<ShowSong>): Promise<void> => await this.showSongDataService.update$(showId, songId, data);
}
