import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {UserService} from '../../../services/user/user.service';
import {faSignInAlt, faUserPlus} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.less'],
})
export class LoginComponent implements OnInit {
  public form: FormGroup = new FormGroup({
    user: new FormControl(null, [Validators.required, Validators.email]),
    pass: new FormControl(null, [Validators.required]),
  });
  public errorMessage = '';
  public faSignIn = faSignInAlt;
  public faNewUser = faUserPlus;

  public constructor(private userService: UserService, private router: Router) {}

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
