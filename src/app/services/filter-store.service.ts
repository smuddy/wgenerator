import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {FilterValues as SongFilterValues} from '../modules/songs/song-list/filter/filter-values';
import {FilterValues as ShowFilterValues} from '../modules/shows/list/filter/filter-values';

const DEFAULT_SONG_FILTER: SongFilterValues = {
  q: '',
  type: '',
  key: '',
  legalType: '',
  flag: '',
};

const DEFAULT_SHOW_FILTER: ShowFilterValues = {
  time: 1,
  owner: '',
  showType: '',
  archived: false,
};

@Injectable({
  providedIn: 'root',
})
export class FilterStoreService {
  private readonly songFilterSubject = new BehaviorSubject<SongFilterValues>(DEFAULT_SONG_FILTER);
  private readonly showFilterSubject = new BehaviorSubject<ShowFilterValues>(DEFAULT_SHOW_FILTER);

  public readonly songFilter$: Observable<SongFilterValues> = this.songFilterSubject.asObservable();
  public readonly showFilter$: Observable<ShowFilterValues> = this.showFilterSubject.asObservable();

  public updateSongFilter(filter: Partial<SongFilterValues>): void {
    this.songFilterSubject.next({
      ...this.songFilterSubject.value,
      ...filter,
    });
  }

  public updateShowFilter(filter: Partial<ShowFilterValues>): void {
    this.showFilterSubject.next({
      ...this.showFilterSubject.value,
      ...filter,
    });
  }

  public resetSongFilter(): void {
    this.songFilterSubject.next(DEFAULT_SONG_FILTER);
  }

  public resetShowFilter(): void {
    this.showFilterSubject.next(DEFAULT_SHOW_FILTER);
  }
}
