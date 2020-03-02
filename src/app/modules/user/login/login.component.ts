import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {AngularFireAuth} from '@angular/fire/auth';
import {Router} from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.less']
})
export class LoginComponent implements OnInit {
  public form: FormGroup;
  public errorMessage: string;

  constructor(public afAuth: AngularFireAuth, private router: Router) {
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
        await this.afAuth.auth.signInWithEmailAndPassword(this.form.value.user, this.form.value.pass);
        await this.router.navigateByUrl('/');
      } catch (ex) {
        this.errorMessage = ex.code;
      }
    }
  }
}
