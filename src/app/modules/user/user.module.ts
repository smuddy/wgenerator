import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {LoginComponent} from './login/login.component';
import {UserRoutingModule} from './user-routing.module';
import {CardModule} from '../../widget-modules/components/card/card.module';
import {MatLegacyFormFieldModule as MatFormFieldModule} from '@angular/material/legacy-form-field';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatLegacyInputModule as MatInputModule} from '@angular/material/legacy-input';
import {ButtonRowModule} from '../../widget-modules/components/button-row/button-row.module';
import {MatLegacyButtonModule as MatButtonModule} from '@angular/material/legacy-button';
import {AuthMessagePipe} from './login/auth-message.pipe';
import {InfoComponent} from './info/info.component';
import {LogoutComponent} from './logout/logout.component';
import {RolePipe} from './info/role.pipe';
import {MatLegacySelectModule as MatSelectModule} from '@angular/material/legacy-select';
import {PasswordComponent} from './password/password.component';
import {PasswordSendComponent} from './password-send/password-send.component';
import {UsersComponent} from './info/users/users.component';
import {RoleModule} from '../../services/user/role.module';
import {UserComponent} from './info/users/user/user.component';
import {NewComponent} from './new/new.component';
import {ButtonModule} from '../../widget-modules/components/button/button.module';
import {LogoModule} from '../../widget-modules/components/logo/logo.module';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {SortByModule} from '../../widget-modules/pipes/sort-by/sort-by.module';

@NgModule({
  declarations: [LoginComponent, AuthMessagePipe, InfoComponent, LogoutComponent, RolePipe, PasswordComponent, PasswordSendComponent, UsersComponent, UserComponent, NewComponent],
  imports: [
    CommonModule,
    UserRoutingModule,
    CardModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatInputModule,
    ButtonRowModule,
    MatButtonModule,
    MatSelectModule,
    FormsModule,
    RoleModule,
    ButtonModule,
    LogoModule,
    FontAwesomeModule,
    SortByModule,
  ],
})
export class UserModule {}
