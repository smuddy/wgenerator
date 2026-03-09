import {AfterViewInit, Component, inject} from '@angular/core';
import {Router} from '@angular/router';
import {UserService} from '../../../services/user/user.service';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.less'],
})
export class LogoutComponent implements AfterViewInit {
  private userService = inject(UserService);
  private router = inject(Router);

  public ngAfterViewInit(): void {
    void (async () => {
      await this.userService.logout();
      await this.router.navigateByUrl('/');
    })();
  }
}
