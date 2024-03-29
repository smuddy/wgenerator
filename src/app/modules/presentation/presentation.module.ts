import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {PresentationRoutingModule} from './presentation-routing.module';
import {MonitorComponent} from './monitor/monitor.component';
import {RemoteComponent} from './remote/remote.component';
import {CardModule} from '../../widget-modules/components/card/card.module';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatSelectModule} from '@angular/material/select';
import {ShowTypeTranslaterModule} from '../../widget-modules/pipes/show-type-translater/show-type-translater.module';
import {SectionTypeTranslatorModule} from '../../widget-modules/pipes/section-type-translator/section-type-translator.module';
import {SongTextModule} from '../../widget-modules/components/song-text/song-text.module';
import {LegalComponent} from './monitor/legal/legal.component';
import {MatButtonModule} from '@angular/material/button';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {MatSliderModule} from '@angular/material/slider';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {AddSongModule} from '../../widget-modules/components/add-song/add-song.module';
import {LogoComponent} from './monitor/logo/logo.component';
import {SelectComponent} from './select/select.component';
import {MatInputModule} from '@angular/material/input';
import {UserNameModule} from '../../services/user/user-name/user-name.module';

@NgModule({
  declarations: [MonitorComponent, RemoteComponent, LegalComponent, LogoComponent, SelectComponent],
  exports: [RemoteComponent],
  imports: [
    CommonModule,
    PresentationRoutingModule,
    CardModule,
    MatFormFieldModule,
    MatSelectModule,
    ShowTypeTranslaterModule,
    SectionTypeTranslatorModule,
    SongTextModule,
    MatButtonModule,
    FontAwesomeModule,
    MatSliderModule,
    FormsModule,
    AddSongModule,
    ReactiveFormsModule,
    MatInputModule,
    UserNameModule,
  ],
})
export class PresentationModule {}
