import {Component, OnInit, inject} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {Router, RouterLink} from '@angular/router';
import {UserService} from '../../../services/user/user.service';
import {faSignInAlt, faUserPlus} from '@fortawesome/free-solid-svg-icons';
import {LogoComponent} from '../../../widget-modules/components/logo/logo.component';
import {MatFormField, MatLabel} from '@angular/material/form-field';
import {MatInput} from '@angular/material/input';

import {MatButton} from '@angular/material/button';
import {AuthMessagePipe} from './auth-message.pipe';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.less'],
  imports: [LogoComponent, ReactiveFormsModule, MatFormField, MatLabel, MatInput, MatButton, RouterLink, AuthMessagePipe],
})
export class LoginComponent implements OnInit {
  private userService = inject(UserService);
  private router = inject(Router);

  public form = new FormGroup({
    user: new FormControl<string>('', {nonNullable: true, validators: [Validators.required, Validators.email]}),
    pass: new FormControl<string>('', {nonNullable: true, validators: [Validators.required]}),
  });
  public errorMessage = '';
  public faSignIn = faSignInAlt;
  public faNewUser = faUserPlus;

  public ngOnInit(): void {
    this.form.reset();
  }

  public async onLogin(): Promise<void> {
    this.form.updateValueAndValidity();
    if (this.form.valid) {
      try {
        await this.userService.login(this.form.controls.user.value, this.form.controls.pass.value);
        await this.router.navigateByUrl('/');
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
