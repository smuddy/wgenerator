import {Component} from '@angular/core';
import {UserService} from '../../../services/user/user.service';
import {Observable} from 'rxjs';
import {User} from '../../../services/user/user';

@Component({
  selector: 'app-new-user',
  templateUrl: './new-user.component.html',
  styleUrls: ['./new-user.component.less']
})
export class NewUserComponent {
  public user$: Observable<User>;

  constructor(private userService: UserService) {
    this.user$ = userService.user$;
  }
}
