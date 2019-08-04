import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {SongsRoutingModule} from './songs-routing.module';
import {SongsComponent} from './components/songs/songs.component';
import {TableComponent} from './components/songs/table/table.component';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {MatButtonModule, MatChipsModule, MatTableModule} from '@angular/material';


@NgModule({
    declarations: [SongsComponent, TableComponent],
    imports: [
        CommonModule,
        SongsRoutingModule,
        FontAwesomeModule,

        MatTableModule,
        MatChipsModule,
        MatButtonModule
    ]
})
export class SongsModule {
}
