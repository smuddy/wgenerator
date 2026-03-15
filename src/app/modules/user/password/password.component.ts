import {Component, OnInit, inject} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {UserService} from '../../../services/user/user.service';
import {faWindowRestore} from '@fortawesome/free-solid-svg-icons';
import {CardComponent} from '../../../widget-modules/components/card/card.component';
import {MatFormField, MatLabel} from '@angular/material/form-field';
import {MatInput} from '@angular/material/input';
import {ButtonRowComponent} from '../../../widget-modules/components/button-row/button-row.component';
import {ButtonComponent} from '../../../widget-modules/components/button/button.component';

import {AuthMessagePipe} from '../login/auth-message.pipe';

@Component({
  selector: 'app-password',
  templateUrl: './password.component.html',
  styleUrls: ['./password.component.less'],
  imports: [CardComponent, ReactiveFormsModule, MatFormField, MatLabel, MatInput, ButtonRowComponent, ButtonComponent, AuthMessagePipe],
})
export class PasswordComponent implements OnInit {
  public userService = inject(UserService);
  private router = inject(Router);

  public form = new FormGroup({
    user: new FormControl<string>('', {nonNullable: true, validators: [Validators.required, Validators.email]}),
  });

  public errorMessage = '';
  public faNewPassword = faWindowRestore;

  public ngOnInit(): void {
    this.form.reset();
  }

  public async onResetPassword(): Promise<void> {
    this.form.updateValueAndValidity();
    if (this.form.valid) {
      try {
        await this.userService.changePassword(this.form.controls.user.value);
        await this.router.navigateByUrl('/user/password-send');
      } catch (error) {
        this.errorMessage = this.errorCode(error);
      }
    }
  }

  private errorCode(error: unknown): string {
    if (typeof error === 'object' && error !== null && 'code' in error && typeof error.code === 'string') {
      return error.code;
    }

    return 'unknown_error';
  }
}
