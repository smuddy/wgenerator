import {Injectable} from '@angular/core';
import {ShowSongDataService} from './show-song-data.service';
import {firstValueFrom, Observable} from 'rxjs';
import {ShowSong} from './show-song';
import {SongDataService} from '../../songs/services/song-data.service';
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
    const song = await firstValueFrom(this.songDataService.read$(songId));
    const user = await firstValueFrom(this.userService.user$);
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
  public read = (showId: string, songId: string): Promise<ShowSong | null> => firstValueFrom(this.read$(showId, songId));

  public list$ = (showId: string): Observable<ShowSong[]> => this.showSongDataService.list$(showId);
  public list = (showId: string): Promise<ShowSong[]> => firstValueFrom(this.list$(showId));

  public async delete$(showId: string, songId: string, index: number): Promise<void> {
    await this.showSongDataService.delete(showId, songId);
    const show = await firstValueFrom(this.showService.read$(showId));
    if (!show) return;
    const order = show.order;
    order.splice(index, 1);
    await this.showService.update$(showId, {order});
  }

  public update$ = async (showId: string, songId: string, data: Partial<ShowSong>): Promise<void> => await this.showSongDataService.update$(showId, songId, data);
}
