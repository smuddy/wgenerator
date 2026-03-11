import {Component, Input, inject} from '@angular/core';
import {ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup} from '@angular/forms';
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

  public filterFormGroup: UntypedFormGroup;
  @Input() public songs: Song[] = [];
  public types = SongService.TYPES;
  public legalType = SongService.LEGAL_TYPE;
  public keys = KEYS;

  public constructor() {
    const fb = inject(UntypedFormBuilder);

    this.filterFormGroup = fb.group({
      q: '',
      type: '',
      key: '',
      legalType: '',
      flag: '',
    });

    this.filterStore.songFilter$.subscribe(filterValues => {
      this.filterFormGroup.patchValue(filterValues, {emitEvent: false});
    });

    this.filterFormGroup.controls.q.valueChanges.subscribe(_ => this.filterValueChanged('q', (_ as string) ?? ''));
    this.filterFormGroup.controls.key.valueChanges.subscribe(_ => this.filterValueChanged('key', (_ as string) ?? ''));
    this.filterFormGroup.controls.type.valueChanges.subscribe(_ => this.filterValueChanged('type', (_ as string) ?? ''));
    this.filterFormGroup.controls.legalType.valueChanges.subscribe(_ => this.filterValueChanged('legalType', (_ as string) ?? ''));
    this.filterFormGroup.controls.flag.valueChanges.subscribe(_ => this.filterValueChanged('flag', (_ as string) ?? ''));
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
