import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SongComponent} from './song.component';
import {CardModule} from '../../../widget-modules/components/card/card.module';
import {MatButtonModule} from '@angular/material/button';
import {ButtonRowModule} from '../../../widget-modules/components/button-row/button-row.module';
import {RouterModule} from '@angular/router';
import {MatChipsModule} from '@angular/material/chips';
import {RoleModule} from '../../../services/user/role.module';
import {ButtonModule} from '../../../widget-modules/components/button/button.module';
import {FileComponent} from './file/file.component';
import {MatMenuModule} from '@angular/material/menu';
import {SongTextComponent} from '../../../widget-modules/components/song-text/song-text.component';
import {LegalOwnerPipe} from '../../../widget-modules/pipes/legal-owner-translator/legal-owner.pipe';
import {ShowTypePipe} from '../../../widget-modules/pipes/show-type-translater/show-type.pipe';
import {SongTypePipe} from '../../../widget-modules/pipes/song-type-translater/song-type.pipe';
import {StatusPipe} from '../../../widget-modules/pipes/status-translater/status.pipe';

@NgModule({
  declarations: [SongComponent, FileComponent],
  exports: [SongComponent],
  imports: [
    CommonModule,
    CardModule,
    RouterModule,

    SongTypePipe,
    MatButtonModule,
    ButtonRowModule,
    LegalOwnerPipe,
    SongTextComponent,
    MatChipsModule,
    RoleModule,
    StatusPipe,
    ButtonModule,
    MatMenuModule,
    ShowTypePipe,
  ],
})
export class SongModule {}
