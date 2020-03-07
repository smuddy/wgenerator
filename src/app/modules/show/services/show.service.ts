import {Injectable} from '@angular/core';
import {ShowDataService} from './show-data.service';
import {Show} from './show';

@Injectable({
  providedIn: 'root'
})
export class ShowService {

  public SHOW_TYPE = ['praise', 'worship', 'homegroup', 'prayergroup'];

  constructor(private showDataService: ShowDataService) {
  }

  public async new(data: Partial<Show>): Promise<string> {
    return await this.showDataService.add(data);
  }
}
