import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {LoginComponent} from './login/login.component';
import {UserRoutingModule} from './user-routing.module';

import {MatFormFieldModule} from '@angular/material/form-field';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatInputModule} from '@angular/material/input';

import {MatButtonModule} from '@angular/material/button';
import {AuthMessagePipe} from './login/auth-message.pipe';
import {InfoComponent} from './info/info.component';
import {LogoutComponent} from './logout/logout.component';
import {RolePipe} from './info/role.pipe';
import {MatSelectModule} from '@angular/material/select';
import {PasswordComponent} from './password/password.component';
import {PasswordSendComponent} from './password-send/password-send.component';
import {UsersComponent} from './info/users/users.component';

import {UserComponent} from './info/users/user/user.component';
import {NewComponent} from './new/new.component';


import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {SortByPipe} from '../../widget-modules/pipes/sort-by/sort-by.pipe';

@NgModule({
    imports: [
    CommonModule,
    UserRoutingModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    FormsModule,
    FontAwesomeModule,
    SortByPipe,
    LoginComponent, AuthMessagePipe, InfoComponent, LogoutComponent, RolePipe, PasswordComponent, PasswordSendComponent, UsersComponent, UserComponent, NewComponent,
],
})
export class UserModule {}
