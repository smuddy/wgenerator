import {Component, Input, inject} from '@angular/core';
import {UserService} from '../user.service';
import {map} from 'rxjs/operators';
import {Observable} from 'rxjs';
import {AsyncPipe} from '@angular/common';

@Component({
  selector: 'app-user-name',
  templateUrl: './user-name.component.html',
  styleUrls: ['./user-name.component.less'],
  imports: [AsyncPipe],
})
export class UserNameComponent {
  private userService = inject(UserService);

  public name$: Observable<string | null> | null = null;

  @Input()
  public set userId(id: string) {
    this.name$ = this.userService.getUserbyId$(id).pipe(map(_ => _?.name ?? null));
  }
}
