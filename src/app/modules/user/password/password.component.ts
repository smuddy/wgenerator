import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {UserService} from '../../../services/user/user.service';
import {faWindowRestore} from '@fortawesome/free-solid-svg-icons/faWindowRestore';

@Component({
  selector: 'app-password',
  templateUrl: './password.component.html',
  styleUrls: ['./password.component.less']
})
export class PasswordComponent implements OnInit {
  public form: FormGroup;
  public errorMessage: string;
  public faNewPassword = faWindowRestore;

  constructor(public userService: UserService, private router: Router) {
  }

  public ngOnInit(): void {
    this.form = new FormGroup({
      user: new FormControl(null, [Validators.required, Validators.email])
    });
  }

  public async onResetPassword() {
    this.form.updateValueAndValidity();
    if (this.form.valid) {
      try {
        await this.userService.changePassword(this.form.value.user);
        await this.router.navigateByUrl('/user/password-send');
      } catch (ex) {
        this.errorMessage = ex.code;
      }
    }
  }

}
