import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {UserService} from '../../../services/user/user.service';

@Component({
  selector: 'app-new',
  templateUrl: './new.component.html',
  styleUrls: ['./new.component.less']
})
export class NewComponent implements OnInit {
  public form: FormGroup;

  constructor(private fb: FormBuilder, private userService: UserService) {
  }

  ngOnInit(): void {
    this.form = this.fb.group({
      email: new FormControl(null, [Validators.required, Validators.email]),
      name: new FormControl(null, [Validators.required]),
      password: new FormControl(null, [Validators.required, Validators.minLength(6)]),
    })
  }

  public async onCreate(): Promise<void> {
    this.form.updateValueAndValidity();
    console.log(this.form);
    if (this.form.valid) {
      try {
        await this.userService.createNewUser(this.form.value.email, this.form.value.name, this.form.value.password);
      } catch (ex) {
        console.error(ex);
      }
    }
  }
}
