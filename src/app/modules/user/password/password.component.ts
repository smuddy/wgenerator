import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {UserService} from '../../../services/user/user.service';
import {faWindowRestore} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-password',
  templateUrl: './password.component.html',
  styleUrls: ['./password.component.less'],
})
export class PasswordComponent implements OnInit {
  public form: FormGroup = new FormGroup({
    user: new FormControl(null, [Validators.required, Validators.email]),
  });

  public errorMessage = '';
  public faNewPassword = faWindowRestore;

  public constructor(public userService: UserService, private router: Router) {}

  public ngOnInit(): void {
    this.form.reset();
  }

  public async onResetPassword(): Promise<void> {
    this.form.updateValueAndValidity();
    if (this.form.valid) {
      try {
        const value = this.form.value as {user: string};
        await this.userService.changePassword(value.user);
        await this.router.navigateByUrl('/user/password-send');
      } catch ({code}) {
        this.errorMessage = code as string;
      }
    }
  }
}
