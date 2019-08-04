import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SongFormComponent} from './song-form.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatInputModule, MatRadioModule, MatSelectModule} from '@angular/material';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';


@NgModule({
    declarations: [
        SongFormComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        FontAwesomeModule,

        MatInputModule,
        MatSelectModule,
        MatRadioModule,

    ],
    exports: [
        SongFormComponent
    ]
})
export class SongFormModule {
}
