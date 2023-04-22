import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {AddSongComponent} from './add-song.component';
import {MatLegacyFormFieldModule as MatFormFieldModule} from '@angular/material/legacy-form-field';
import {MatLegacySelectModule as MatSelectModule} from '@angular/material/legacy-select';
import {NgxMatSelectSearchModule} from 'ngx-mat-select-search';
import {ReactiveFormsModule} from '@angular/forms';

@NgModule({
  declarations: [AddSongComponent],
  exports: [AddSongComponent],
  imports: [CommonModule, MatFormFieldModule, MatSelectModule, NgxMatSelectSearchModule, ReactiveFormsModule],
})
export class AddSongModule {}
