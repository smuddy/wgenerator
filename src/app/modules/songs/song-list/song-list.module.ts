import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SongListComponent} from './song-list.component';
import {CardModule} from '../../../widget-modules/components/card/card.module';
import {RouterModule} from '@angular/router';
import {LegalTypeTranslatorModule} from '../../../widget-modules/pipes/legal-type-translator/legal-type-translator.module';
import {ListHeaderModule} from '../../../widget-modules/components/list-header/list-header.module';
import {MatLegacyFormFieldModule as MatFormFieldModule} from '@angular/material/legacy-form-field';
import {MatLegacyInputModule as MatInputModule} from '@angular/material/legacy-input';
import {FilterComponent} from './filter/filter.component';
import {ReactiveFormsModule} from '@angular/forms';
import {MatLegacySelectModule as MatSelectModule} from '@angular/material/legacy-select';
import {SongTypeTranslaterModule} from '../../../widget-modules/pipes/song-type-translater/song-type-translater.module';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {MatLegacyTooltipModule as MatTooltipModule} from '@angular/material/legacy-tooltip';
import {RoleModule} from '../../../services/user/role.module';
import {KeyTranslatorModule} from '../../../widget-modules/pipes/key-translator/key-translator.module';

@NgModule({
  declarations: [SongListComponent, FilterComponent],
  exports: [SongListComponent],
  imports: [
    CommonModule,
    RouterModule,

    CardModule,
    LegalTypeTranslatorModule,
    ListHeaderModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatSelectModule,
    SongTypeTranslaterModule,
    FontAwesomeModule,
    MatTooltipModule,
    RoleModule,
    KeyTranslatorModule,
  ],
})
export class SongListModule {}
