import {Component, Input, OnInit} from '@angular/core';
import {Song} from '../../services/song';
import {faBalanceScaleRight} from '@fortawesome/free-solid-svg-icons/faBalanceScaleRight';

@Component({
  selector: 'app-list-item',
  templateUrl: './list-item.component.html',
  styleUrls: ['./list-item.component.less']
})
export class ListItemComponent implements OnInit {
  @Input() public song: Song;
  public faLegal = faBalanceScaleRight;

  constructor() {
  }

  ngOnInit() {
  }

}
