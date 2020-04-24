import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {faFilter} from '@fortawesome/free-solid-svg-icons/faFilter';
import {faPlus} from '@fortawesome/free-solid-svg-icons/faPlus';
import {fade} from '../../../animations';

@Component({
  selector: 'app-list-header',
  templateUrl: './list-header.component.html',
  styleUrls: ['./list-header.component.less'],
  animations: [fade]
})
export class ListHeaderComponent implements OnInit {

  public faNew = faPlus;
  public faFilter = faFilter;
  public filterVisible = false;
  @Output() filterVisibleChanged = new EventEmitter<boolean>();
  @Input() anyFilterActive = false;

  constructor() {
  }

  ngOnInit() {
  }

  public onFilterClick(): void {
    this.filterVisible = !this.filterVisible || this.anyFilterActive;
  }
}
