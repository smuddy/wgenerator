import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SongListComponent} from './song-list.component';
import {CardModule} from '../../../widget-modules/components/card/card.module';
import {RouterModule} from '@angular/router';
import {ListHeaderModule} from '../../../widget-modules/components/list-header/list-header.module';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {FilterComponent} from './filter/filter.component';
import {ReactiveFormsModule} from '@angular/forms';
import {MatSelectModule} from '@angular/material/select';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {MatTooltipModule} from '@angular/material/tooltip';
import {RoleModule} from '../../../services/user/role.module';
import {KeyPipe} from '../../../widget-modules/pipes/key-translator/key.pipe';
import {LegalTypePipe} from '../../../widget-modules/pipes/legal-type-translator/legal-type.pipe';
import {SongTypePipe} from '../../../widget-modules/pipes/song-type-translater/song-type.pipe';

@NgModule({
  declarations: [SongListComponent, FilterComponent],
  exports: [SongListComponent],
  imports: [
    CommonModule,
    RouterModule,

    CardModule,
    LegalTypePipe,
    ListHeaderModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatSelectModule,
    FontAwesomeModule,
    MatTooltipModule,
    RoleModule,
    KeyPipe,
    SongTypePipe,
  ],
})
export class SongListModule {}
