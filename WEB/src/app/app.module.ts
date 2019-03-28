import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ODataModule } from 'odata-v4-ng';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressBarModule } from '@angular/material/progress-bar';

import { TableComponent } from './components/songs/table/table.component';
import { SongsComponent } from './components/songs/songs.component';
import { SongComponent } from './components/songs/song/song.component';
import { SongEditComponent } from './components/songs/song-edit/song-edit.component';
import { SongNewComponent } from './components/songs/song-new/song-new.component';
import { SongFormComponent } from './components/songs/song-form/song-form.component';
import { SongFilesComponent } from './components/songs/song-files/song-files.component';
import { FileUploadModule } from 'ng2-file-upload';
import { SongFileEditComponent } from './components/songs/song-file-edit/song-file-edit.component';

@NgModule({
  declarations: [
    AppComponent,
    SongsComponent,
    TableComponent,
    SongComponent,
    SongEditComponent,
    SongNewComponent,
    SongFormComponent,
    SongFilesComponent,
    SongFileEditComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    ODataModule,

    MatInputModule,
    MatCardModule,
    MatTableModule,
    MatButtonModule,
    MatChipsModule,
    MatRadioModule,
    MatSelectModule,
    MatTooltipModule,
    MatProgressBarModule,

    FontAwesomeModule,
    FileUploadModule,
    AppRoutingModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
