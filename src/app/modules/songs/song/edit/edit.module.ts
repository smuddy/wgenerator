import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {EditComponent} from './edit.component';
import {CardModule} from '../../../../widget-modules/components/card/card.module';
import {SongTypeTranslaterModule} from '../../../../widget-modules/pipes/song-type-translater/song-type-translater.module';
import {ReactiveFormsModule} from '@angular/forms';
import {MatLegacyInputModule as MatInputModule} from '@angular/material/legacy-input';
import {MatLegacyCheckboxModule as MatCheckboxModule} from '@angular/material/legacy-checkbox';
import {MatLegacySelectModule as MatSelectModule} from '@angular/material/legacy-select';
import {MatLegacyButtonModule as MatButtonModule} from '@angular/material/legacy-button';
import {ButtonRowModule} from '../../../../widget-modules/components/button-row/button-row.module';
import {RouterModule} from '@angular/router';
import {EditSongComponent} from './edit-song/edit-song.component';
import {EditFileComponent} from './edit-file/edit-file.component';
import {MatIconModule} from '@angular/material/icon';
import {FileComponent} from './edit-file/file/file.component';
import {LegalOwnerTranslatorModule} from '../../../../widget-modules/pipes/legal-owner-translator/legal-owner-translator.module';
import {LegalTypeTranslatorModule} from '../../../../widget-modules/pipes/legal-type-translator/legal-type-translator.module';
import {KeyTranslatorModule} from '../../../../widget-modules/pipes/key-translator/key-translator.module';
import {MatLegacyChipsModule as MatChipsModule} from '@angular/material/legacy-chips';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {StatusTranslaterModule} from '../../../../widget-modules/pipes/status-translater/status-translater.module';
import {ButtonModule} from '../../../../widget-modules/components/button/button.module';
import {MatLegacyTooltipModule as MatTooltipModule} from '@angular/material/legacy-tooltip';
import {SaveDialogComponent} from './edit-song/save-dialog/save-dialog.component';
import {MatLegacyDialogModule as MatDialogModule} from '@angular/material/legacy-dialog';
import {HistoryComponent} from './history/history.component';
import {SongTextModule} from '../../../../widget-modules/components/song-text/song-text.module';

@NgModule({
  declarations: [EditComponent, EditSongComponent, EditFileComponent, FileComponent, SaveDialogComponent, HistoryComponent],
  exports: [EditComponent],
  bootstrap: [SaveDialogComponent],
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
    LegalOwnerTranslatorModule,
    LegalTypeTranslatorModule,
    KeyTranslatorModule,
    MatChipsModule,
    FontAwesomeModule,
    StatusTranslaterModule,
    ButtonModule,
    MatTooltipModule,
    MatDialogModule,
    SongTextModule,
  ],
})
export class EditModule {}
