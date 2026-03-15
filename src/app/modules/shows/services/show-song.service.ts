import {Injectable, inject} from '@angular/core';
import {ShowSongDataService} from './show-song-data.service';
import {firstValueFrom, Observable} from 'rxjs';
import {ShowSong} from './show-song';
import {SongDataService} from '../../songs/services/song-data.service';
import {UserService} from '../../../services/user/user.service';
import {ShowService} from './show.service';
import {arrayRemove, arrayUnion} from 'firebase/firestore';

@Injectable({
  providedIn: 'root',
})
export class ShowSongService {
  private showSongDataService = inject(ShowSongDataService);
  private songDataService = inject(SongDataService);
  private userService = inject(UserService);
  private showService = inject(ShowService);

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
    const showSongId = await this.showSongDataService.add(showId, data);
    await Promise.all([this.userService.incSongCount(songId), this.showService.update$(showId, {songIds: arrayUnion(songId) as never})]);
    return showSongId;
  }

  public read$ = (showId: string, songId: string): Observable<ShowSong | null> => this.showSongDataService.read$(showId, songId);
  public read = (showId: string, songId: string): Promise<ShowSong | null> => firstValueFrom(this.read$(showId, songId));

  public list$ = (showId: string): Observable<ShowSong[]> => this.showSongDataService.list$(showId);
  public list = (showId: string): Promise<ShowSong[]> => firstValueFrom(this.list$(showId));

  public async delete$(showId: string, showSongId: string, index: number): Promise<void> {
    const [showSong, show, showSongs] = await Promise.all([this.read(showId, showSongId), firstValueFrom(this.showService.read$(showId)), this.list(showId)]);
    if (!show) return;
    if (!showSong) return;

    const order = [...show.order];
    order.splice(index, 1);
    const hasSameSongStillInShow = showSongs.some(song => song.id !== showSongId && song.songId === showSong.songId);

    await Promise.all([
      this.showSongDataService.delete(showId, showSongId),
      this.showService.update$(showId, hasSameSongStillInShow ? {order} : {order, songIds: arrayRemove(showSong.songId) as never}),
      this.userService.decSongCount(showSong.songId),
    ]);
  }

  public update$ = async (showId: string, songId: string, data: Partial<ShowSong>): Promise<void> => await this.showSongDataService.update$(showId, songId, data);
}
