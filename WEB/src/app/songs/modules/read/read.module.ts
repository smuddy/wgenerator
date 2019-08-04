import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {ReadRoutingModule} from './read-routing.module';
import {SongFormModule} from '../widget-modules/song-form/song-form.module';
import {SongComponent} from './song/song.component';
import {SongReadComponent} from './read/read.component';
import {SongFilesEditComponent} from './files/edit/song-files-edit.component';
import {SongFilesComponent} from './files/files.component';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {
    MatButtonModule,
    MatCardModule,
    MatChipsModule,
    MatInputModule,
    MatSelectModule,
    MatTableModule,
    MatTooltipModule
} from '@angular/material';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {FileUploadModule} from 'ng2-file-upload';


@NgModule({
    declarations: [
        SongComponent,
        SongReadComponent,
        SongFilesEditComponent,
        SongFilesComponent
    ],
    imports: [
        CommonModule,
        ReadRoutingModule,
        SongFormModule,
        FontAwesomeModule,
        FormsModule,
        ReactiveFormsModule,
        FileUploadModule,

        MatCardModule,
        MatChipsModule,
        MatSelectModule,
        MatInputModule,
        MatTableModule,
        MatButtonModule,
        MatTooltipModule
    ]
})
export class ReadModule {
}
