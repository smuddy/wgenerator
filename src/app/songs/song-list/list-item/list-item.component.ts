import {Component, Input, OnInit} from '@angular/core';
import {Song} from "../../models/song";

@Component({
  selector: 'app-list-item',
  templateUrl: './list-item.component.html',
  styleUrls: ['./list-item.component.less']
})
export class ListItemComponent implements OnInit {
  @Input() public song: Song;

  constructor() {
  }

  ngOnInit() {
  }

}
