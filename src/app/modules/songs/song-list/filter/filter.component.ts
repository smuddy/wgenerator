import {Component, DestroyRef, Input, inject} from '@angular/core';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {FormBuilder, FormControl, FormGroup, ReactiveFormsModule} from '@angular/forms';
import {debounceTime, distinctUntilChanged} from 'rxjs/operators';
import {SongService} from '../../services/song.service';
import {FilterValues} from './filter-values';
import {Song} from '../../services/song';
import {KEYS} from '../../services/key.helper';
import {FilterStoreService} from '../../../../services/filter-store.service';
import {MatFormField, MatLabel} from '@angular/material/form-field';
import {MatInput} from '@angular/material/input';
import {MatSelect} from '@angular/material/select';
import {MatOption} from '@angular/material/core';

import {LegalTypePipe} from '../../../../widget-modules/pipes/legal-type-translator/legal-type.pipe';
import {KeyPipe} from '../../../../widget-modules/pipes/key-translator/key.pipe';
import {SongTypePipe} from '../../../../widget-modules/pipes/song-type-translater/song-type.pipe';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.less'],
  imports: [ReactiveFormsModule, MatFormField, MatLabel, MatInput, MatSelect, MatOption, LegalTypePipe, KeyPipe, SongTypePipe],
})
export class FilterComponent {
  private filterStore = inject(FilterStoreService);
  private destroyRef = inject(DestroyRef);

  public filterFormGroup: FormGroup<{
    q: FormControl<string>;
    type: FormControl<string>;
    key: FormControl<string>;
    legalType: FormControl<string>;
    flag: FormControl<string>;
  }>;
  @Input() public songs: Song[] = [];
  public types = SongService.TYPES;
  public legalType = SongService.LEGAL_TYPE;
  public keys = KEYS;

  public constructor() {
    const fb = inject(FormBuilder);

    this.filterFormGroup = fb.nonNullable.group({
      q: '',
      type: '',
      key: '',
      legalType: '',
      flag: '',
    });

    this.filterStore.songFilter$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(filterValues => {
      this.filterFormGroup.patchValue(filterValues, {emitEvent: false});
    });

    this.filterFormGroup.controls.q.valueChanges
      .pipe(debounceTime(100), distinctUntilChanged(), takeUntilDestroyed(this.destroyRef))
      .subscribe(value => this.filterValueChanged('q', value));
    this.filterFormGroup.controls.key.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(value => this.filterValueChanged('key', value));
    this.filterFormGroup.controls.type.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(value => this.filterValueChanged('type', value));
    this.filterFormGroup.controls.legalType.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(value => this.filterValueChanged('legalType', value));
    this.filterFormGroup.controls.flag.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(value => this.filterValueChanged('flag', value));
  }

  public getFlags(): string[] {
    const flags = this.songs
      .map(_ => _.flags)
      .filter(_ => !!_)
      .map(_ => _.split(';'))
      .reduce((pn, u) => [...pn, ...u], [])
      .filter(_ => !!_);

    return flags.filter((n, i) => flags.indexOf(n) === i);
  }

  private filterValueChanged(key: keyof FilterValues, value: string): void {
    this.filterStore.updateSongFilter({[key]: value} as Partial<FilterValues>);
  }
}
