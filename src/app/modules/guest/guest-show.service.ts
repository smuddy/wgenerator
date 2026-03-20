import {Injectable, inject} from '@angular/core';
import {Show} from '../shows/services/show';
import {Song} from '../songs/services/song';
import {GuestShowDataService} from './guest-show-data.service';
import {ShowService} from '../shows/services/show.service';

@Injectable({
  providedIn: 'root',
})
export class GuestShowService {
  private showService = inject(ShowService);
  private guestShowDataService = inject(GuestShowDataService);

  public async share(show: Show, songs: Song[]): Promise<string> {
    const data = {
      showType: show.showType,
      date: show.date,
      updatedAt: new Date(),
      songs: songs,
    };
    let shareId = show.shareId;

    if (!show.shareId) {
      shareId = await this.guestShowDataService.add(data);
      await this.showService.update$(show.id, {shareId});
    } else {
      await this.guestShowDataService.update$(show.shareId, data);
    }

    return window.location.protocol + '//' + window.location.host + '/guest/' + shareId;
  }
}
