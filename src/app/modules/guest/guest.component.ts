import {Component, OnInit} from '@angular/core';
import {SongService} from '../songs/services/song.service';
import {GlobalSettingsService} from '../../services/global-settings.service';
import {Observable} from 'rxjs';
import {map, switchMap} from 'rxjs/operators';
import {ShowSongService} from '../shows/services/show-song.service';

@Component({
  selector: 'app-guest',
  templateUrl: './guest.component.html',
  styleUrls: ['./guest.component.less']
})
export class GuestComponent implements OnInit {
  public songs$: Observable<Observable<string>[]>;


  constructor(
    private songService: SongService,
    private globalSettingsService: GlobalSettingsService,
    private showSongService: ShowSongService,
  ) {
  }

  public ngOnInit(): void {
    this.songs$ = this.globalSettingsService.get$.pipe(
      map(_ => _.currentShow),
      switchMap(_ => this.showSongService.list$(_)),
      map(_ => _
        .sort((x, y) => x.order - y.order)
        .map(showSong => this.songService.read$(showSong.songId).pipe(map(song => song.text)))
      )
    );
  }

}
