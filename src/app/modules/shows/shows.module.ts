import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {ShowsRoutingModule} from './shows-routing.module';
import {NewComponent} from './new/new.component';

import {MatFormFieldModule} from '@angular/material/form-field';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import {ListComponent} from './list/list.component';
import {ListItemComponent} from './list/list-item/list-item.component';

import {MatCheckboxModule} from '@angular/material/checkbox';

import {MatButtonModule} from '@angular/material/button';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatSelectModule} from '@angular/material/select';
import {MatNativeDateModule} from '@angular/material/core';
import {ShowComponent} from './show/show.component';
import {SongComponent} from './show/song/song.component';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';

import {NgxMatSelectSearchModule} from 'ngx-mat-select-search';

import {MatMenuModule} from '@angular/material/menu';
import {DragDropModule} from '@angular/cdk/drag-drop';

import {MatTooltipModule} from '@angular/material/tooltip';
import {FilterComponent} from './list/filter/filter.component';
import {EditComponent} from './edit/edit.component';
import {ArchiveDialogComponent} from './dialog/archive-dialog/archive-dialog.component';
import {MatDialogModule} from '@angular/material/dialog';
import {SongTextComponent} from '../../widget-modules/components/song-text/song-text.component';
import {AddSongComponent} from '../../widget-modules/components/add-song/add-song.component';
import {ShowTypePipe} from '../../widget-modules/pipes/show-type-translater/show-type.pipe';
import {SortByPipe} from '../../widget-modules/pipes/sort-by/sort-by.pipe';

@NgModule({
  imports: [
    CommonModule,
    ShowsRoutingModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatInputModule,
    MatCheckboxModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSelectModule,
    ShowTypePipe,
    FontAwesomeModule,
    FormsModule,
    SongTextComponent,
    NgxMatSelectSearchModule,
    AddSongComponent,
    MatMenuModule,
    DragDropModule,
    SortByPipe,
    MatTooltipModule,
    MatDialogModule,
    NewComponent,
    ListComponent,
    ListItemComponent,
    ShowComponent,
    SongComponent,
    FilterComponent,
    EditComponent,
    ArchiveDialogComponent,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class ShowsModule {}
