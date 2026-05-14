import {Component, DestroyRef, Input, inject} from '@angular/core';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {FormBuilder, FormControl, FormGroup, ReactiveFormsModule} from '@angular/forms';
import {debounceTime, distinctUntilChanged} from 'rxjs/operators';
import {faFilterCircleXmark} from '@fortawesome/free-solid-svg-icons';
import {SongService} from '../../services/song.service';
import {FilterValues} from './filter-values';
import {Song} from '../../services/song';
import {hasAvailableKeyForRoot, KEY_FILTER_ACCIDENTALS, KEY_FILTER_MODES, KEY_FILTER_ROOTS, supportsKeyAccidental} from '../../services/key.helper';
import {FilterStoreService} from '../../../../services/filter-store.service';
import {MatFormField, MatLabel} from '@angular/material/form-field';
import {MatInput} from '@angular/material/input';
import {MatSelect} from '@angular/material/select';
import {MatOption} from '@angular/material/core';

import {LegalTypePipe} from '../../../../widget-modules/pipes/legal-type-translator/legal-type.pipe';
import {SongTypePipe} from '../../../../widget-modules/pipes/song-type-translater/song-type.pipe';
import {ButtonComponent} from '../../../../widget-modules/components/button/button.component';
import {MatButtonToggle, MatButtonToggleGroup} from '@angular/material/button-toggle';
import {MatCheckbox} from '@angular/material/checkbox';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.less'],
  imports: [ReactiveFormsModule, MatFormField, MatLabel, MatInput, MatSelect, MatOption, LegalTypePipe, SongTypePipe, ButtonComponent, MatButtonToggleGroup, MatButtonToggle, MatCheckbox],
})
export class FilterComponent {
  private filterStore = inject(FilterStoreService);
  private destroyRef = inject(DestroyRef);
  public faResetFilter = faFilterCircleXmark;

  public filterFormGroup: FormGroup<{
    q: FormControl<string>;
    type: FormControl<string>;
    keyRoot: FormControl<string>;
    keyMode: FormControl<string>;
    keyAccidental: FormControl<string>;
    includeRelativeMinor: FormControl<boolean>;
    legalType: FormControl<string>;
    flag: FormControl<string>;
  }>;
  @Input() public songs: Song[] = [];
  public types = SongService.TYPES;
  public legalType = SongService.LEGAL_TYPE;
  public keyRoots = KEY_FILTER_ROOTS;
  public keyModes = KEY_FILTER_MODES;
  public keyAccidentals = KEY_FILTER_ACCIDENTALS;

  public constructor() {
    const fb = inject(FormBuilder);

    this.filterFormGroup = fb.nonNullable.group({
      q: '',
      type: '',
      keyRoot: '',
      keyMode: 'major',
      keyAccidental: '',
      includeRelativeMinor: false as boolean,
      legalType: '',
      flag: '',
    });

    this.filterStore.songFilter$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(filterValues => {
      this.filterFormGroup.patchValue(filterValues, {emitEvent: false});
    });

    this.filterFormGroup.controls.q.valueChanges
      .pipe(debounceTime(100), distinctUntilChanged(), takeUntilDestroyed(this.destroyRef))
      .subscribe(value => this.filterValueChanged('q', value));
    this.filterFormGroup.controls.keyRoot.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(value => this.updateKeyRoot(value));
    this.filterFormGroup.controls.keyMode.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(value => this.updateKeyMode(value));
    this.filterFormGroup.controls.keyAccidental.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(value => this.filterValueChanged('keyAccidental', value));
    this.filterFormGroup.controls.includeRelativeMinor.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(value => this.filterValueChanged('includeRelativeMinor', value));
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

  public get filterActive(): boolean {
    const filter = this.filterFormGroup.getRawValue();
    return !!(filter.q || filter.type || filter.keyRoot || filter.legalType || filter.flag);
  }

  public resetFilter(): void {
    this.filterStore.resetSongFilter();
  }

  public isAccidentalDisabled(accidental: string): boolean {
    const root = this.filterFormGroup.controls.keyRoot.value;
    return !!root && !supportsKeyAccidental(root, accidental);
  }

  public isKeyRootDisabled(root: string): boolean {
    return !hasAvailableKeyForRoot(root, this.songs.map(song => song.key));
  }

  private updateKeyRoot(value: string): void {
    this.filterValueChanged('keyRoot', value);
  }

  private updateKeyMode(value: string): void {
    this.filterValueChanged('keyMode', value);
  }

  private filterValueChanged(key: keyof FilterValues, value: string | boolean): void {
    this.filterStore.updateSongFilter({[key]: value} as Partial<FilterValues>);
  }
}
