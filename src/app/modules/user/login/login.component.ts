import {Component, OnInit} from '@angular/core';
import {ReactiveFormsModule, UntypedFormControl, UntypedFormGroup, Validators} from '@angular/forms';
import {Router, RouterLink} from '@angular/router';
import {UserService} from '../../../services/user/user.service';
import {faSignInAlt, faUserPlus} from '@fortawesome/free-solid-svg-icons';
import {LogoComponent} from '../../../widget-modules/components/logo/logo.component';
import {MatFormField, MatLabel} from '@angular/material/form-field';
import {MatInput} from '@angular/material/input';
import {NgIf} from '@angular/common';
import {MatButton} from '@angular/material/button';
import {AuthMessagePipe} from './auth-message.pipe';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.less'],
  imports: [LogoComponent, ReactiveFormsModule, MatFormField, MatLabel, MatInput, NgIf, MatButton, RouterLink, AuthMessagePipe],
})
export class LoginComponent implements OnInit {
  public form: UntypedFormGroup = new UntypedFormGroup({
    user: new UntypedFormControl(null, [Validators.required, Validators.email]),
    pass: new UntypedFormControl(null, [Validators.required]),
  });
  public errorMessage = '';
  public faSignIn = faSignInAlt;
  public faNewUser = faUserPlus;

  public constructor(
    private userService: UserService,
    private router: Router
  ) {}

  public ngOnInit(): void {
    this.form.reset;
  }

  public async onLogin(): Promise<void> {
    this.form.updateValueAndValidity();
    if (this.form.valid) {
      try {
        const value = this.form.value as {user: string; pass: string};
        await this.userService.login(value.user, value.pass);
        await this.router.navigateByUrl('/');
      } catch ({code}) {
        this.errorMessage = code as string;
      }
    }
  }
}
