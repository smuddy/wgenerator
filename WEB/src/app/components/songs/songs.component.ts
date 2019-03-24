import { Component } from '@angular/core';
import { SongsService } from 'src/app/data/songs.service';

@Component({
  selector: 'app-songs',
  templateUrl: './songs.component.html',
  styleUrls: ['./songs.component.less']
})
export class SongsComponent {
  constructor(songService: SongsService) {
    songService.loadSongList();
  }
}
