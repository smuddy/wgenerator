import {Component, Input} from '@angular/core';
import {User} from '../../../../../services/user/user';
import {UserService} from '../../../../../services/user/user.service';
import {ROLE_TYPES} from '../../../../../services/user/roles';
import {faTimes} from '@fortawesome/free-solid-svg-icons';
import { NgIf, NgFor } from '@angular/common';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatSelect } from '@angular/material/select';
import { MatOption } from '@angular/material/core';
import { MatIconButton } from '@angular/material/button';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { RolePipe } from '../../role.pipe';

@Component({
    selector: 'app-user',
    templateUrl: './user.component.html',
    styleUrls: ['./user.component.less'],
    imports: [
        NgIf,
        MatFormField,
        MatLabel,
        MatInput,
        ReactiveFormsModule,
        FormsModule,
        MatSelect,
        NgFor,
        MatOption,
        MatIconButton,
        FaIconComponent,
        RolePipe,
    ],
})
export class UserComponent {
  public id = '';
  public name = '';
  public roles: string[] = [];
  public ROLE_TYPES = ROLE_TYPES;
  public edit = false;
  public faClose = faTimes;

  public constructor(private userService: UserService) {
  }

  @Input()
  public set user(value: User) {
    this.id = value.id;
    this.name = value.name;
    this.roles = this.getRoleArray(value.role);
  }

  public async onRoleChanged(id: string, roles: string[]): Promise<void> {
    const role = roles.join(';');
    await this.userService.update$(id, {role});
  }

  public async onNameChanged(id: string, name: Event): Promise<void> {
    const target = name.target as HTMLInputElement;
    await this.userService.update$(id, {name: target.value});
  }

  public getRoleArray(role: string): string[] {
    return role ? role.split(';') : [];
  }
}
