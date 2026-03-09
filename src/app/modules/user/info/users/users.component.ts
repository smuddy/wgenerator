import {Component} from '@angular/core';
import {UserService} from '../../../../services/user/user.service';
import {Observable} from 'rxjs';
import {User} from '../../../../services/user/user';
import {CardComponent} from '../../../../widget-modules/components/card/card.component';
import {AsyncPipe} from '@angular/common';
import {UserComponent} from './user/user.component';
import {SortByPipe} from '../../../../widget-modules/pipes/sort-by/sort-by.pipe';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.less'],
  imports: [CardComponent, UserComponent, AsyncPipe, SortByPipe],
})
export class UsersComponent {
  public users$: Observable<User[]>;

  public constructor(private userService: UserService) {
    this.users$ = userService.list$();
  }
}
