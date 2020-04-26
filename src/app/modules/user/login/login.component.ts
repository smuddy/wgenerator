import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {UserService} from '../../../services/user/user.service';
import {faSignInAlt} from '@fortawesome/free-solid-svg-icons/faSignInAlt';
import {faWindowRestore} from '@fortawesome/free-solid-svg-icons/faWindowRestore';
import {faUserPlus} from '@fortawesome/free-solid-svg-icons/faUserPlus';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.less']
})
export class LoginComponent implements OnInit {
  public form: FormGroup;
  public errorMessage: string;
  public faSignIn = faSignInAlt;
  public faNewPassword = faWindowRestore;
  public faNewUser = faUserPlus;

  constructor(private userService: UserService, private router: Router) {
  }

  ngOnInit() {
    this.form = new FormGroup({
      user: new FormControl(null, [Validators.required, Validators.email]),
      pass: new FormControl(null, [Validators.required]),
    });
  }

  public async onLogin() {
    this.form.updateValueAndValidity();
    if (this.form.valid) {
      try {
        await this.userService.login(this.form.value.user, this.form.value.pass);
        await this.router.navigateByUrl('/');
      } catch (ex) {
        this.errorMessage = ex.code;
      }
    }
  }
}
