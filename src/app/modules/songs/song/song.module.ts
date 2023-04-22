import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SongComponent} from './song.component';
import {CardModule} from '../../../widget-modules/components/card/card.module';
import {SongTypeTranslaterModule} from '../../../widget-modules/pipes/song-type-translater/song-type-translater.module';
import {MatLegacyButtonModule as MatButtonModule} from '@angular/material/legacy-button';
import {ButtonRowModule} from '../../../widget-modules/components/button-row/button-row.module';
import {RouterModule} from '@angular/router';
import {LegalOwnerTranslatorModule} from '../../../widget-modules/pipes/legal-owner-translator/legal-owner-translator.module';
import {SongTextModule} from '../../../widget-modules/components/song-text/song-text.module';
import {MatLegacyChipsModule as MatChipsModule} from '@angular/material/legacy-chips';
import {RoleModule} from '../../../services/user/role.module';
import {StatusTranslaterModule} from '../../../widget-modules/pipes/status-translater/status-translater.module';
import {ButtonModule} from '../../../widget-modules/components/button/button.module';
import {FileComponent} from './file/file.component';
import {MatLegacyMenuModule as MatMenuModule} from '@angular/material/legacy-menu';
import {ShowTypeTranslaterModule} from '../../../widget-modules/pipes/show-type-translater/show-type-translater.module';

@NgModule({
  declarations: [SongComponent, FileComponent],
  exports: [SongComponent],
  imports: [
    CommonModule,
    CardModule,
    RouterModule,

    SongTypeTranslaterModule,
    MatButtonModule,
    ButtonRowModule,
    LegalOwnerTranslatorModule,
    SongTextModule,
    MatChipsModule,
    RoleModule,
    StatusTranslaterModule,
    ButtonModule,
    MatMenuModule,
    ShowTypeTranslaterModule,
  ],
})
export class SongModule {}
