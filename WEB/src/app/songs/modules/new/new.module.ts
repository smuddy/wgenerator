import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {NewRoutingModule} from './new-routing.module';
import {SongFormModule} from '../widget-modules/song-form/song-form.module';
import {SongNewComponent} from './song-new/song-new.component';
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
        SongNewComponent
    ],
    imports: [
        CommonModule,
        NewRoutingModule,
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
export class NewModule {
}
