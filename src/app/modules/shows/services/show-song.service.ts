import {Injectable} from '@angular/core';
import {ShowSongDataService} from './show-song-data.service';

@Injectable({
  providedIn: 'root'
})
export class ShowSongService {

  constructor(private showSongDataService: ShowSongDataService) {
  }

  public async new$(showId: string, songId: string): Promise<string> {
    const data = {songId};
    return await this.showSongDataService.add(showId, data);
  }
}
