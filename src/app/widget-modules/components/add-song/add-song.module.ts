import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {AddSongComponent} from './add-song.component';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatSelectModule} from '@angular/material/select';
import {NgxMatSelectSearchModule} from 'ngx-mat-select-search';
import {ReactiveFormsModule} from '@angular/forms';


@NgModule({
  declarations: [AddSongComponent],
  exports: [
    AddSongComponent
  ],
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatSelectModule,
    NgxMatSelectSearchModule,
    ReactiveFormsModule
  ]
})
export class AddSongModule {
}
