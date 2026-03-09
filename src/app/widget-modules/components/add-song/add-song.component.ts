import {ChangeDetectionStrategy, Component, Input, inject} from '@angular/core';
import {ReactiveFormsModule, UntypedFormControl} from '@angular/forms';
import {filterSong} from '../../../services/filter.helper';
import {MatFormField, MatLabel, MatOption, MatSelect, MatSelectChange} from '@angular/material/select';
import {Song} from '../../../modules/songs/services/song';
import {ShowSong} from '../../../modules/shows/services/show-song';
import {ShowSongService} from '../../../modules/shows/services/show-song.service';
import {Show} from '../../../modules/shows/services/show';
import {ShowService} from '../../../modules/shows/services/show.service';

import {NgxMatSelectSearchModule} from 'ngx-mat-select-search';

@Component({
  selector: 'app-add-song',
  templateUrl: './add-song.component.html',
  styleUrls: ['./add-song.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatFormField, MatSelect, MatOption, MatLabel, NgxMatSelectSearchModule, ReactiveFormsModule],
})
export class AddSongComponent {
  private showSongService = inject(ShowSongService);
  private showService = inject(ShowService);

  @Input() public songs: Song[] | null = null;
  @Input() public showSongs: ShowSong[] | null = null;
  @Input() public show: Show | null = null;
  @Input() public addedLive = false;
  public filteredSongsControl = new UntypedFormControl();

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
    if (!this.show) return;
    const newId = await this.showSongService.new$(this.show?.id, event.value as string, this.addedLive);
    await this.showService.update$(this.show?.id, {order: [...this.show.order, newId ?? '']});
    event.source.value = null;
  }
}
