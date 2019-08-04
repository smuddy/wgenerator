import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {EditRoutingModule} from './edit-routing.module';
import {SongFormModule} from '../widget-modules/song-form/song-form.module';
import {SongEditComponent} from './song-edit/song-edit.component';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {FileUploadModule} from 'ng2-file-upload';
import {
    MatButtonModule,
    MatCardModule,
    MatChipsModule,
    MatInputModule,
    MatSelectModule,
    MatTableModule,
    MatTooltipModule
} from '@angular/material';


@NgModule({
    declarations: [
        SongEditComponent
    ],
    imports: [
        CommonModule,
        EditRoutingModule,
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
export class EditModule {
}
