import { Component, OnInit, Input } from '@angular/core';
import { SongListModel } from 'src/app/models/song-list.model';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.less']
})
export class TableComponent implements OnInit {
  @Input() public songs: SongListModel;
  public columns = [
    'Id',
    'Name',
    'Key',
    'Type',
    'Velocity',
  ];

  constructor() { }

  ngOnInit() {
    console.log(this.songs);
  }


}
