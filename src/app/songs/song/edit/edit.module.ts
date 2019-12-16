import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {EditComponent} from './edit.component';
import {CardModule} from '../../../widget-modules/components/card/card.module';
import {SongTypeTranslaterModule} from '../../../widget-modules/pipes/song-type-translater/song-type-translater.module';
import {ReactiveFormsModule} from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatSelectModule} from '@angular/material/select';
import {MatButtonModule} from '@angular/material/button';
import {ButtonRowModule} from '../../../widget-modules/components/button-row/button-row.module';
import {RouterModule} from '@angular/router';
import { EditSongComponent } from './edit-song/edit-song.component';
import { EditFileComponent } from './edit-file/edit-file.component';
import {MatIconModule} from '@angular/material/icon';


@NgModule({
  declarations: [EditComponent, EditSongComponent, EditFileComponent],
  exports: [EditComponent],
  imports: [
    CommonModule,
    CardModule,
    SongTypeTranslaterModule,
    ReactiveFormsModule,
    RouterModule,

    MatInputModule,
    MatButtonModule,
    MatCheckboxModule,
    MatSelectModule,
    ButtonRowModule,

    MatIconModule,

  ]
})
export class EditModule {
}
