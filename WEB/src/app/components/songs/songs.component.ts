import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SongListModel } from 'src/app/models/song-list.model';

@Component({
  selector: 'app-songs',
  templateUrl: './songs.component.html',
  styleUrls: ['./songs.component.less']
})
export class SongsComponent implements OnInit {
  public songs: SongListModel;

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.data.subscribe((data: { songs: SongListModel }) => {
      this.songs = data.songs;
    });
  }


}
