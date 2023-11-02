import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {ShowsRoutingModule} from './shows-routing.module';
import {NewComponent} from './new/new.component';
import {CardModule} from '../../widget-modules/components/card/card.module';
import {MatLegacyFormFieldModule as MatFormFieldModule} from '@angular/material/legacy-form-field';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatLegacyInputModule as MatInputModule} from '@angular/material/legacy-input';
import {ListComponent} from './list/list.component';
import {ListItemComponent} from './list/list-item/list-item.component';
import {ListHeaderModule} from '../../widget-modules/components/list-header/list-header.module';
import {MatLegacyCheckboxModule as MatCheckboxModule} from '@angular/material/legacy-checkbox';
import {ButtonRowModule} from '../../widget-modules/components/button-row/button-row.module';
import {MatLegacyButtonModule as MatButtonModule} from '@angular/material/legacy-button';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatLegacySelectModule as MatSelectModule} from '@angular/material/legacy-select';
import {ShowTypeTranslaterModule} from '../../widget-modules/pipes/show-type-translater/show-type-translater.module';
import {MatNativeDateModule} from '@angular/material/core';
import {ShowComponent} from './show/show.component';
import {SongComponent} from './show/song/song.component';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {MenuButtonModule} from '../../widget-modules/components/menu-button/menu-button.module';
import {SongTextModule} from '../../widget-modules/components/song-text/song-text.module';
import {NgxMatSelectSearchModule} from 'ngx-mat-select-search';
import {AddSongModule} from '../../widget-modules/components/add-song/add-song.module';
import {ButtonModule} from '../../widget-modules/components/button/button.module';
import {OwnerModule} from '../../services/user/owner.module';
import {UserNameModule} from '../../services/user/user-name/user-name.module';
import {MatLegacyMenuModule as MatMenuModule} from '@angular/material/legacy-menu';
import {DragDropModule} from '@angular/cdk/drag-drop';
import {RoleModule} from '../../services/user/role.module';
import {SortByModule} from '../../widget-modules/pipes/sort-by/sort-by.module';
import {MatLegacyTooltipModule as MatTooltipModule} from '@angular/material/legacy-tooltip';
import {FilterComponent} from './list/filter/filter.component';
import {EditComponent} from './edit/edit.component';
import {ArchiveDialogComponent} from './dialog/archive-dialog/archive-dialog.component';
import {MatLegacyDialogModule as MatDialogModule} from '@angular/material/legacy-dialog';

@NgModule({
  declarations: [NewComponent, ListComponent, ListItemComponent, ShowComponent, SongComponent, FilterComponent, EditComponent, ArchiveDialogComponent],
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
    SongTextModule,
    NgxMatSelectSearchModule,
    AddSongModule,
    ButtonModule,
    OwnerModule,
    UserNameModule,
    MatMenuModule,
    DragDropModule,
    RoleModule,
    SortByModule,
    MatTooltipModule,
    MatDialogModule,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class ShowsModule {}
