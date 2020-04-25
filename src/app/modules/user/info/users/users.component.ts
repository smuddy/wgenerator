import {Component, OnInit} from '@angular/core';
import {UserService} from '../../../../services/user/user.service';
import {Observable} from 'rxjs';
import {User} from '../../../../services/user/user';
import {ROLE_TYPES} from '../../../../services/user/roles';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.less']
})
export class UsersComponent implements OnInit {
  public users$: Observable<User[]>;
  public ROLE_TYPES = ROLE_TYPES;

  constructor(private userService: UserService) {
    this.users$ = userService.list$();
  }

  ngOnInit(): void {

  }

  public async onRoleChanged(id: string, role: any): Promise<void> {
    await this.userService.update$(id, {role});
  }

  public async onNameChanged(id: string, name: any): Promise<void> {
    await this.userService.update$(id, {name: name.target.value});
  }
}
