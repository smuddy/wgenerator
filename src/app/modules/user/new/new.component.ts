import {Component, OnInit, inject} from '@angular/core';
import {FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';
import {UserService} from '../../../services/user/user.service';
import {faUserPlus} from '@fortawesome/free-solid-svg-icons';
import {CardComponent} from '../../../widget-modules/components/card/card.component';
import {MatFormField, MatLabel} from '@angular/material/form-field';
import {MatInput} from '@angular/material/input';
import {ButtonRowComponent} from '../../../widget-modules/components/button-row/button-row.component';
import {ButtonComponent} from '../../../widget-modules/components/button/button.component';
import {AuthMessagePipe} from '../login/auth-message.pipe';

@Component({
  selector: 'app-new',
  templateUrl: './new.component.html',
  styleUrls: ['./new.component.less'],
  imports: [CardComponent, ReactiveFormsModule, MatFormField, MatLabel, MatInput, ButtonRowComponent, ButtonComponent, AuthMessagePipe],
})
export class NewComponent implements OnInit {
  private fb = inject(FormBuilder);
  private userService = inject(UserService);

  public form = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    name: ['', [Validators.required]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });
  public faNewUser = faUserPlus;
  public errorMessage = '';

  public ngOnInit(): void {
    this.form.reset();
  }

  public async onCreate(): Promise<void> {
    this.form.updateValueAndValidity();
    if (this.form.valid) {
      try {
        this.errorMessage = '';
        const {email, name, password} = this.form.getRawValue();
        await this.userService.createNewUser(email, name, password);
      } catch (ex) {
        this.errorMessage = this.errorCode(ex);
      }
    }
  }

  private errorCode(ex: unknown): string {
    if (typeof ex === 'object' && ex !== null && 'code' in ex && typeof ex.code === 'string') {
      return ex.code;
    }

    return 'unknown_error';
  }
}
