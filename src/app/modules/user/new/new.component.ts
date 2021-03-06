import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {UserService} from '../../../services/user/user.service';
import {faUserPlus} from '@fortawesome/free-solid-svg-icons/faUserPlus';

@Component({
  selector: 'app-new',
  templateUrl: './new.component.html',
  styleUrls: ['./new.component.less'],
})
export class NewComponent implements OnInit {
  public form: FormGroup = this.fb.group({
    email: new FormControl(null, [Validators.required, Validators.email]),
    name: new FormControl(null, [Validators.required]),
    password: new FormControl(null, [Validators.required, Validators.minLength(6)]),
  });
  public faNewUser = faUserPlus;

  public constructor(private fb: FormBuilder, private userService: UserService) {}

  public ngOnInit(): void {
    this.form.reset();
  }

  public async onCreate(): Promise<void> {
    this.form.updateValueAndValidity();
    if (this.form.valid) {
      try {
        const value = this.form.value as {
          email: string;
          name: string;
          password: string;
        };
        await this.userService.createNewUser(value.email, value.name, value.password);
      } catch (ex) {
        console.error(ex);
      }
    }
  }
}
