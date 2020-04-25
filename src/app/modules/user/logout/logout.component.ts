import {AfterViewInit, Component} from '@angular/core';
import {Router} from '@angular/router';
import {UserService} from '../../../services/user/user.service';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.less']
})
export class LogoutComponent implements AfterViewInit {
  constructor(private userService: UserService, private router: Router) {
  }

  public async ngAfterViewInit() {
    await this.userService.logout();
    await this.router.navigateByUrl('/');
  }
}
