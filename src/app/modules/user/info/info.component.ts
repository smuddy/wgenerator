import {Component, OnInit} from '@angular/core';
import {UserService} from '../../../services/user/user.service';
import {Observable} from 'rxjs';
import {User} from '../../../services/user/user';
import {ChordMode} from '../../../widget-modules/components/song-text/song-text.component';
import {faSignOutAlt} from '@fortawesome/free-solid-svg-icons';
import {RolePipe} from './role.pipe';
import {roles} from '../../../services/user/roles';

@Component({
  selector: 'app-info',
  templateUrl: './info.component.html',
  styleUrls: ['./info.component.less'],
})
export class InfoComponent implements OnInit {
  public user$: Observable<User | null> | null = null;
  public faSignOut = faSignOutAlt;

  public constructor(private userService: UserService) {}

  public ngOnInit(): void {
    this.user$ = this.userService.user$;
  }

  public async onChordModeChanged(uid: string, value: ChordMode): Promise<void> {
    await this.userService.update$(uid, {chordMode: value});
  }

  public getUserRoles = (roles: string): roles[] => (roles?.split(';') ?? []) as roles[];
  public transdormUserRoles = (roles: roles): string =>
    this.getUserRoles(roles)
      .map(_ => new RolePipe().transform(_))
      .join(', ');
}
