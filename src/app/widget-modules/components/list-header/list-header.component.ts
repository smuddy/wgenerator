import {Component, EventEmitter, Input, Output} from '@angular/core';
import {faFilter, faPlus} from '@fortawesome/free-solid-svg-icons';
import {fade} from '../../../animations';

@Component({
  selector: 'app-list-header',
  templateUrl: './list-header.component.html',
  styleUrls: ['./list-header.component.less'],
  animations: [fade],
})
export class ListHeaderComponent {
  public faNew = faPlus;
  public faFilter = faFilter;
  public filterVisible = false;
  @Output() public filterVisibleChanged = new EventEmitter<boolean>();
  @Input() public anyFilterActive = false;

  public onFilterClick(): void {
    this.filterVisible = !this.filterVisible || this.anyFilterActive;
  }
}
