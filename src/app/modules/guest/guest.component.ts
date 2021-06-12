import {Component} from '@angular/core';
import {SongService} from '../songs/services/song.service';
import {GlobalSettingsService} from '../../services/global-settings.service';
import {Observable} from 'rxjs';
import {filter, map, switchMap} from 'rxjs/operators';
import {ShowSongService} from '../shows/services/show-song.service';
import {GlobalSettings} from '../../services/global-settings';
import {ShowService} from '../shows/services/show.service';

@Component({
  selector: 'app-guest',
  templateUrl: './guest.component.html',
  styleUrls: ['./guest.component.less'],
})
export class GuestComponent {
  public songs$: Observable<string[]> = this.globalSettingsService.get$.pipe(
    filter(_ => !!_),
    map(_ => _ as GlobalSettings),
    map(_ => _.currentShow),
    switchMap(_ => this.showSongService.list$(_).pipe(map(l => ({showSongs: l, currentShow: _})))),
    switchMap(_ => this.showService.read$(_.currentShow).pipe(map(l => ({showSongs: _.showSongs, show: l})))),
    filter(_ => !!_.showSongs),
    map(_ => (_?.show ? _.show.order.map(o => _.showSongs.find(f => f.id === o) ?? _.showSongs[0]).map(m => m.text) : []))
  );

  public constructor(
    private songService: SongService,
    private showService: ShowService,
    private globalSettingsService: GlobalSettingsService,
    private showSongService: ShowSongService
  ) {}
}
