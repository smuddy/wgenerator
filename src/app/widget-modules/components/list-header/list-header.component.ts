import {Component, EventEmitter, Input, Output} from '@angular/core';
import {faFilter, faPlus} from '@fortawesome/free-solid-svg-icons';
import {fade} from '../../../animations';
import { MatIconButton } from '@angular/material/button';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { RouterLink } from '@angular/router';
import { NgIf } from '@angular/common';
import { CardComponent } from '../card/card.component';

@Component({
    selector: 'app-list-header',
    templateUrl: './list-header.component.html',
    styleUrls: ['./list-header.component.less'],
    animations: [fade],
    imports: [
        MatIconButton,
        FaIconComponent,
        RouterLink,
        NgIf,
        CardComponent,
    ],
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
