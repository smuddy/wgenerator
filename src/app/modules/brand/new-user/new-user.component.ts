import {Component, inject} from '@angular/core';
import {UserService} from '../../../services/user/user.service';
import {Observable} from 'rxjs';
import {User} from '../../../services/user/user';
import {BrandComponent} from '../brand.component';
import {AsyncPipe} from '@angular/common';

@Component({
  selector: 'app-new-user',
  templateUrl: './new-user.component.html',
  styleUrls: ['./new-user.component.less'],
  imports: [BrandComponent, AsyncPipe],
})
export class NewUserComponent {
  private userService = inject(UserService);

  public user$: Observable<User | null> | null = null;

  public constructor() {
    const userService = this.userService;

    this.user$ = userService.user$;
  }
}
