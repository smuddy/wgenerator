import {Component} from '@angular/core';
import {UserService} from '../../../../services/user/user.service';
import {Observable} from 'rxjs';
import {User} from '../../../../services/user/user';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.less'],
})
export class UsersComponent {
  public users$: Observable<User[]>;

  public constructor(private userService: UserService) {
    this.users$ = userService.list$();
  }
}
