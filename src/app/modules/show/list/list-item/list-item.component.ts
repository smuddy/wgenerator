import {Component, Input, OnInit} from '@angular/core';
import {Show} from '../../services/show';

@Component({
  selector: 'app-list-item',
  templateUrl: './list-item.component.html',
  styleUrls: ['./list-item.component.less']
})
export class ListItemComponent implements OnInit {
  @Input() public show: Show;

  constructor() {
  }

  ngOnInit() {
  }

}
