import {Component, OnInit} from '@angular/core';
import {faFilter} from '@fortawesome/free-solid-svg-icons/faFilter';
import {faBars} from '@fortawesome/free-solid-svg-icons/faBars';
import {faPlus} from '@fortawesome/free-solid-svg-icons/faPlus';

@Component({
  selector: 'app-list-header',
  templateUrl: './list-header.component.html',
  styleUrls: ['./list-header.component.less']
})
export class ListHeaderComponent implements OnInit {

  public faNew = faPlus;
  public faFilter = faFilter;
  public faMenu = faBars;

  constructor() {
  }

  ngOnInit() {
  }

}
