import {Component, Input} from '@angular/core';
import {FormControl} from '@angular/forms';
import {filterSong} from '../../../services/filter.helper';
import {MatSelectChange} from '@angular/material/select';
import {Song} from '../../../modules/songs/services/song';
import {ShowSong} from '../../../modules/shows/services/show-song';
import {ShowSongService} from '../../../modules/shows/services/show-song.service';

@Component({
  selector: 'app-add-song',
  templateUrl: './add-song.component.html',
  styleUrls: ['./add-song.component.less']
})
export class AddSongComponent {
  @Input() public songs: Song[];
  @Input() public showSongs: ShowSong[];
  @Input() public showId: string;
  @Input() public addedLive = false;
  public filteredSongsControl = new FormControl();

  constructor(private showSongService: ShowSongService) {
  }

  filteredSongs() {
    const songs = this.songs
      .filter(_ => !!_)
      .filter(_ => !!_.title)
      .filter(_ => _.title !== 'nicht gefunden')
      .filter(_ => _.title !== 'nicht vorhanden')
      .sort((a, b) => {
        if (a.title < b.title) {
          return -1;
        }
        if (a.title > b.title) {
          return 1;
        }
        return 0;
      });

    const filterValue = this.filteredSongsControl.value;
    return filterValue ? songs.filter(_ => filterSong(_, filterValue)) : songs;
  }

  public async onAddSongSelectionChanged(event: MatSelectChange) {
    const order = this.showSongs.reduce((oa, u) => Math.max(oa, u.order), 0) + 1;
    await this.showSongService.new$(this.showId, event.value, order, this.addedLive);
    event.source.value = null;
  }

}
