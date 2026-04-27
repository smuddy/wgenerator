import {Component, inject, OnInit} from '@angular/core';
import {UserService} from '../../../services/user/user.service';
import {Observable} from 'rxjs';
import {User} from '../../../services/user/user';
import {ChordMode} from '../../../widget-modules/components/song-text/song-text.component';
import {faSignOutAlt} from '@fortawesome/free-solid-svg-icons';
import {RolePipe} from './role.pipe';
import {roles} from '../../../services/user/roles';
import {AsyncPipe} from '@angular/common';
import {CardComponent} from '../../../widget-modules/components/card/card.component';
import {MatFormField, MatHint, MatLabel} from '@angular/material/form-field';
import {MatSelect} from '@angular/material/select';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatOption} from '@angular/material/core';
import {ButtonRowComponent} from '../../../widget-modules/components/button-row/button-row.component';
import {ButtonComponent} from '../../../widget-modules/components/button/button.component';
import {RouterLink} from '@angular/router';
import {RoleDirective} from '../../../services/user/role.directive';
import {UsersComponent} from './users/users.component';
import {PageFrameComponent} from '../../../widget-modules/components/sidebar/page-frame.component';

@Component({
  selector: 'app-info',
  templateUrl: './info.component.html',
  styleUrls: ['./info.component.less'],
  imports: [
    CardComponent,
    MatFormField,
    MatLabel,
    MatSelect,
    ReactiveFormsModule,
    FormsModule,
    MatOption,
    MatHint,
    ButtonRowComponent,
    ButtonComponent,
    RouterLink,
    RoleDirective,
    UsersComponent,
    AsyncPipe,
    PageFrameComponent,
  ],
})
export class InfoComponent implements OnInit {
  private userService = inject(UserService);

  public user$: Observable<User | null> | null = null;
  public faSignOut = faSignOutAlt;

  public ngOnInit(): void {
    this.user$ = this.userService.user$;
  }

  public async onChordModeChanged(uid: string, value: ChordMode): Promise<void> {
    await this.userService.update$(uid, {chordMode: value});
  }

  public getUserRoles = (role: string): roles[] => (role?.split(';') ?? []) as roles[];
  public transdormUserRoles = (role: string): string =>
    this.getUserRoles(role)
      .map(_ => new RolePipe().transform(_))
      .join(', ');
}
