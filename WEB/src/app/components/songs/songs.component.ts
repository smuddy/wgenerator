import { blend } from 'src/app/services/animation';
import { Component } from '@angular/core';
import { SongsService } from 'src/app/data/songs.service';
import { State } from 'src/app/data/state';

@Component({
  selector: 'app-songs',
  templateUrl: './songs.component.html',
  styleUrls: ['./songs.component.less'],
  animations: [blend]
})
export class SongsComponent {
  public State = State;
  constructor(public songsService: SongsService) {
    songsService.loadSongList();
  }
}
