import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {EditComponent} from './edit.component';

import {ReactiveFormsModule} from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatSelectModule} from '@angular/material/select';
import {MatButtonModule} from '@angular/material/button';

import {RouterModule} from '@angular/router';
import {EditSongComponent} from './edit-song/edit-song.component';
import {EditFileComponent} from './edit-file/edit-file.component';
import {MatIconModule} from '@angular/material/icon';
import {FileComponent} from './edit-file/file/file.component';
import {MatChipsModule} from '@angular/material/chips';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';

import {MatTooltipModule} from '@angular/material/tooltip';
import {SaveDialogComponent} from './edit-song/save-dialog/save-dialog.component';
import {MatDialogModule} from '@angular/material/dialog';
import {HistoryComponent} from './history/history.component';
import {SongTextComponent} from '../../../../widget-modules/components/song-text/song-text.component';
import {KeyPipe} from '../../../../widget-modules/pipes/key-translator/key.pipe';
import {LegalOwnerPipe} from '../../../../widget-modules/pipes/legal-owner-translator/legal-owner.pipe';
import {LegalTypePipe} from '../../../../widget-modules/pipes/legal-type-translator/legal-type.pipe';
import {SongTypePipe} from '../../../../widget-modules/pipes/song-type-translater/song-type.pipe';
import {StatusPipe} from '../../../../widget-modules/pipes/status-translater/status.pipe';

@NgModule({
  declarations: [SaveDialogComponent],
  exports: [EditComponent],
  bootstrap: [SaveDialogComponent],
  imports: [
    CommonModule,
    SongTypePipe,
    ReactiveFormsModule,
    RouterModule,
    MatInputModule,
    MatButtonModule,
    MatCheckboxModule,
    MatSelectModule,
    MatIconModule,
    LegalOwnerPipe,
    LegalTypePipe,
    KeyPipe,
    MatChipsModule,
    FontAwesomeModule,
    StatusPipe,
    MatTooltipModule,
    MatDialogModule,
    SongTextComponent,
    EditComponent,
    EditSongComponent,
    EditFileComponent,
    FileComponent,
    HistoryComponent,
  ],
})
export class EditModule {}
