import {Injectable} from '@angular/core';
import {ShowSongDataService} from './show-song-data.service';
import {Observable} from 'rxjs';
import {ShowSong} from './showSong';

@Injectable({
  providedIn: 'root'
})
export class ShowSongService {

  constructor(private showSongDataService: ShowSongDataService) {
  }

  public async new$(showId: string, songId: string, order: number): Promise<string> {
    const data = {songId, order};
    return await this.showSongDataService.add(showId, data);
  }

  public list$ = (showId: string): Observable<ShowSong[]> => this.showSongDataService.list$(showId, _ => _.orderBy('order'));
  public delete$ = (showId: string, songId: string): Promise<void> => this.showSongDataService.delete(showId, songId);
  public update$ = async (showId: string, songId: string, data: Partial<ShowSong>): Promise<void> => await this.showSongDataService.update$(showId, songId, data);
}
