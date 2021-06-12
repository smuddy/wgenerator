import {Component, Input} from '@angular/core';
import {FormControl} from '@angular/forms';
import {filterSong} from '../../../services/filter.helper';
import {MatSelectChange} from '@angular/material/select';
import {Song} from '../../../modules/songs/services/song';
import {ShowSong} from '../../../modules/shows/services/show-song';
import {ShowSongService} from '../../../modules/shows/services/show-song.service';
import {Show} from '../../../modules/shows/services/show';
import {ShowService} from '../../../modules/shows/services/show.service';

@Component({
  selector: 'app-add-song',
  templateUrl: './add-song.component.html',
  styleUrls: ['./add-song.component.less'],
})
export class AddSongComponent {
  @Input() public songs: Song[] | null = null;
  @Input() public showSongs: ShowSong[] | null = null;
  @Input() public show: Show | null = null;
  @Input() public addedLive = false;
  public filteredSongsControl = new FormControl();

  public constructor(private showSongService: ShowSongService, private showService: ShowService) {}

  public filteredSongs(): Song[] {
    if (!this.songs) return [];
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

    const filterValue = this.filteredSongsControl.value as string;
    return filterValue ? songs.filter(_ => filterSong(_, filterValue)) : songs;
  }

  public async onAddSongSelectionChanged(event: MatSelectChange): Promise<void> {
    if (!this.showSongs) return;
    if (!this.show) return;
    const newId = await this.showSongService.new$(this.show?.id, event.value, this.addedLive);
    await this.showService.update$(this.show?.id, {order: [...this.show.order, newId ?? '']});
    event.source.value = null;
  }
}
