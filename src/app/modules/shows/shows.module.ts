import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {ShowsRoutingModule} from './shows-routing.module';
import {NewComponent} from './new/new.component';
import {CardModule} from '../../widget-modules/components/card/card.module';
import {MatFormFieldModule} from '@angular/material/form-field';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import {ListComponent} from './list/list.component';
import {ListItemComponent} from './list/list-item/list-item.component';
import {ListHeaderModule} from '../../widget-modules/components/list-header/list-header.module';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {ButtonRowModule} from '../../widget-modules/components/button-row/button-row.module';
import {MatButtonModule} from '@angular/material/button';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatSelectModule} from '@angular/material/select';
import {ShowTypeTranslaterModule} from '../../widget-modules/pipes/show-type-translater/show-type-translater.module';
import {MatNativeDateModule} from '@angular/material/core';
import {ShowComponent} from './show/show.component';
import {SongComponent} from './show/song/song.component';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {MenuButtonModule} from '../../widget-modules/components/menu-button/menu-button.module';
import {SongTextModule} from '../../widget-modules/components/song-text/song-text.module';


@NgModule({
  declarations: [NewComponent, ListComponent, ListItemComponent, ShowComponent, SongComponent],
  imports: [
    CommonModule,
    ShowsRoutingModule,
    CardModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatInputModule,
    ListHeaderModule,
    MatCheckboxModule,
    ButtonRowModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSelectModule,
    ShowTypeTranslaterModule,
    FontAwesomeModule,
    MenuButtonModule,
    FormsModule,
    SongTextModule
  ]
})
export class ShowsModule {
}