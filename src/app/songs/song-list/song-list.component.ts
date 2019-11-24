import {Component, OnInit} from '@angular/core';
import {SongService} from '../services/song.service';
import {Song} from '../models/song';

@Component({
  selector: 'app-songs',
  templateUrl: './song-list.component.html',
  styleUrls: ['./song-list.component.less']
})
export class SongListComponent implements OnInit {
  public songs: Song[];

  constructor(private songService: SongService) {
  }

  ngOnInit() {
    this.songService.list().subscribe(songs => {
      this.songs = songs.sort((a, b) => a.number - b.number);
    });
  }

}
