import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';

import { TableComponent } from './components/songs/table/table.component';
import { SongsComponent } from './components/songs/songs.component';
import { SongComponent } from './components/song/song.component';

@NgModule({
  declarations: [AppComponent, SongsComponent, TableComponent, SongComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,

    MatCardModule,
    MatTableModule,
    MatButtonModule,

    FontAwesomeModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
