import {Component, Input} from '@angular/core';
import {User} from '../../../../../services/user/user';
import {UserService} from '../../../../../services/user/user.service';
import {ROLE_TYPES} from '../../../../../services/user/roles';
import {faTimes} from '@fortawesome/free-solid-svg-icons/faTimes';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.less']
})
export class UserComponent {
  public id: string;
  public name: string
  public roles: string[];
  public ROLE_TYPES = ROLE_TYPES;
  public edit = false;
  public faClose = faTimes;

  constructor(private userService: UserService) {
  }

  @Input() set user(value: User) {
    this.id = value.id;
    this.name = value.name;
    this.roles = this.getRoleArray(value.role);
  };

  public async onRoleChanged(id: string, roles: string[]): Promise<void> {
    const role = roles.join(';');
    await this.userService.update$(id, {role});
  }

  public async onNameChanged(id: string, name: any): Promise<void> {
    await this.userService.update$(id, {name: name.target.value});
  }

  public getRoleArray(role): string[] {
    return role ? role.split(';') : [];
  }

}
