import {Component} from '@angular/core';
import {SongService} from '../songs/services/song.service';
import {GlobalSettingsService} from '../../services/global-settings.service';
import {Observable} from 'rxjs';
import {filter, map, switchMap} from 'rxjs/operators';
import {ShowSongService} from '../shows/services/show-song.service';
import {GlobalSettings} from '../../services/global-settings';

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
    switchMap(_ => this.showSongService.list$(_)),
    filter(_ => !!_),
    map(_ => _),
    map(_ => _.sort((x, y) => x.order - y.order).map(showSong => showSong.text))
  );

  public constructor(private songService: SongService, private globalSettingsService: GlobalSettingsService, private showSongService: ShowSongService) {}
}
