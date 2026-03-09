import {Component, Input} from '@angular/core';
import {Show} from '../../services/show';
import {DatePipe} from '@angular/common';
import {UserNameComponent} from '../../../../services/user/user-name/user-name.component';
import {ShowTypePipe} from '../../../../widget-modules/pipes/show-type-translater/show-type.pipe';

@Component({
  selector: 'app-list-item',
  templateUrl: './list-item.component.html',
  styleUrls: ['./list-item.component.less'],
  imports: [UserNameComponent, DatePipe, ShowTypePipe],
})
export class ListItemComponent {
  @Input() public show: Show | null = null;
}
