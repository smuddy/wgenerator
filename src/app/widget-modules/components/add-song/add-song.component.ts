import {ChangeDetectionStrategy, ChangeDetectorRef, Component, DestroyRef, Input, inject} from '@angular/core';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {FormControl, ReactiveFormsModule} from '@angular/forms';
import {searchSongs} from '../../../services/filter.helper';
import {MatFormField, MatLabel, MatOption, MatSelect, MatSelectChange} from '@angular/material/select';
import {Song} from '../../../modules/songs/services/song';
import {ShowSong} from '../../../modules/shows/services/show-song';
import {ShowSongService} from '../../../modules/shows/services/show-song.service';
import {Show} from '../../../modules/shows/services/show';
import {ShowService} from '../../../modules/shows/services/show.service';

import {NgxMatSelectSearchModule} from 'ngx-mat-select-search';
import {debounceTime, distinctUntilChanged, startWith} from 'rxjs/operators';

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
  private destroyRef = inject(DestroyRef);
  private cRef = inject(ChangeDetectorRef);

  @Input() public songs: Song[] | null = null;
  @Input() public showSongs: ShowSong[] | null = null;
  @Input() public show: Show | null = null;
  @Input() public addedLive = false;
  public filteredSongsControl = new FormControl<string>('', {nonNullable: true});
  public debouncedFilterValue = '';

  public constructor() {
    this.filteredSongsControl.valueChanges
      .pipe(startWith(this.filteredSongsControl.value), debounceTime(100), distinctUntilChanged(), takeUntilDestroyed(this.destroyRef))
      .subscribe(value => {
        this.debouncedFilterValue = value;
        this.cRef.markForCheck();
      });
  }

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

    const filterValue = this.debouncedFilterValue;
    return filterValue ? searchSongs(songs, filterValue) : songs;
  }

  public async onAddSongSelectionChanged(event: MatSelectChange): Promise<void> {
    if (!this.show) return;
    const newId = await this.showSongService.new$(this.show?.id, event.value as string, this.addedLive);
    await this.showService.update$(this.show?.id, {order: [...this.show.order, newId ?? '']});
    event.source.value = null;
  }
}
