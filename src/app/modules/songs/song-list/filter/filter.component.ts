import {Component, Input} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {UntypedFormBuilder, UntypedFormGroup} from '@angular/forms';
import {SongService} from '../../services/song.service';
import {FilterValues} from './filter-values';
import {Song} from '../../services/song';
import {KEYS} from '../../services/key.helper';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.less'],
})
export class FilterComponent {
  public filterFormGroup: UntypedFormGroup;
  @Input() public route = '/';
  @Input() public songs: Song[] = [];
  public types = SongService.TYPES;
  public legalType = SongService.LEGAL_TYPE;
  public keys = KEYS;

  public constructor(private router: Router, activatedRoute: ActivatedRoute, fb: UntypedFormBuilder) {
    this.filterFormGroup = fb.group({
      q: '',
      type: '',
      key: '',
      legalType: '',
      flag: '',
    });

    activatedRoute.queryParams.subscribe(params => {
      const filterValues = params as FilterValues;
      if (filterValues.q) this.filterFormGroup.controls.q.setValue(filterValues.q);
      if (filterValues.type) this.filterFormGroup.controls.type.setValue(filterValues.type);
      if (filterValues.key) this.filterFormGroup.controls.key.setValue(filterValues.key);
      if (filterValues.legalType) this.filterFormGroup.controls.legalType.setValue(filterValues.legalType);
      if (filterValues.flag) this.filterFormGroup.controls.flag.setValue(filterValues.flag);
    });

    this.filterFormGroup.controls.q.valueChanges.subscribe(_ => void this.filerValueChanged('q', _ as string));
    this.filterFormGroup.controls.key.valueChanges.subscribe(_ => void this.filerValueChanged('key', _ as string));
    this.filterFormGroup.controls.type.valueChanges.subscribe(_ => void this.filerValueChanged('type', _ as string));
    this.filterFormGroup.controls.legalType.valueChanges.subscribe(_ => void this.filerValueChanged('legalType', _ as string));
    this.filterFormGroup.controls.flag.valueChanges.subscribe(_ => void this.filerValueChanged('flag', _ as string));
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

  private async filerValueChanged(key: string, value: string): Promise<void> {
    const route = this.router.createUrlTree([this.route], {
      queryParams: {[key]: value},
      queryParamsHandling: 'merge',
    });
    await this.router.navigateByUrl(route);
  }
}
