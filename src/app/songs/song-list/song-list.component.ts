import {Component, OnInit} from '@angular/core';
import {SongService} from '../services/song.service';
import {Song} from '../models/song';
import {map} from 'rxjs/operators';
import {Observable} from 'rxjs';

@Component({
  selector: 'app-songs',
  templateUrl: './song-list.component.html',
  styleUrls: ['./song-list.component.less']
})
export class SongListComponent implements OnInit {
  public songs: Observable<Song[]>;

  constructor(private songService: SongService) {
  }

  ngOnInit() {
    this.songs = this.songService.list().pipe(map(songs =>
      songs.sort((a, b) => a.number - b.number)
    ));
  }

}
