import { Component, OnInit, Input } from '@angular/core';
import { Song } from 'src/app/models/song.model';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.less']
})
export class TableComponent implements OnInit {
  @Input() public songs: Song[];
  public columns = [
    'Number',
    'Name',
    'Key',
    'SongType',
    'Tempo',
  ];

  constructor() { }

  ngOnInit() {
    console.log(this.songs);
  }


}
