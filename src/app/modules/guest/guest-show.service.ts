import {Injectable} from '@angular/core';
import {Show} from '../shows/services/show';
import {Song} from '../songs/services/song';
import {GuestShowDataService} from './guest-show-data.service';
import {ShowService} from '../shows/services/show.service';

@Injectable({
  providedIn: 'root',
})
export class GuestShowService {
  public constructor(
    private showService: ShowService,
    private guestShowDataService: GuestShowDataService
  ) {}

  public async share(show: Show, songs: Song[]): Promise<string> {
    const data = {
      showType: show.showType,
      date: show.date,
      songs: songs,
    };

    if (!show.shareId) {
      const shareId = await this.guestShowDataService.add(data);
      await this.showService.update$(show.id, {shareId});
    } else {
      await this.guestShowDataService.update$(show.shareId, data);
    }

    return window.location.protocol + '//' + window.location.host + '/guest/' + show.shareId;
  }
}
