import {Component, OnInit} from '@angular/core';
import {UserService} from '../../../services/user.service';
import {Observable} from 'rxjs';
import {User} from '../../../services/user';

@Component({
  selector: 'app-info',
  templateUrl: './info.component.html',
  styleUrls: ['./info.component.less']
})
export class InfoComponent implements OnInit {
  public user$: Observable<User>;

  constructor(private userService: UserService) {
  }

  ngOnInit() {
    this.user$ = this.userService.user$;
  }

}
