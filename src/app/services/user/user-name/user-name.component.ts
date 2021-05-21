import {Component, Input} from '@angular/core';
import {UserService} from '../user.service';
import {map} from 'rxjs/operators';
import {Observable} from 'rxjs';

@Component({
  selector: 'app-user-name',
  templateUrl: './user-name.component.html',
  styleUrls: ['./user-name.component.less'],
})
export class UserNameComponent {
  public name$: Observable<string>;

  public constructor(private userService: UserService) {}

  @Input()
  public set userId(id: string) {
    this.name$ = this.userService.getUserbyId$(id).pipe(map(_ => _.name));
  }
}
