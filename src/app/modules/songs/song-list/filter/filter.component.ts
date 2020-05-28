import {Component, Input, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {FormBuilder, FormGroup} from '@angular/forms';
import {SongService} from '../../services/song.service';
import {FilterValues} from './filter-values';
import {Song} from '../../services/song';
import {KEYS} from '../../services/key.helper';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.less']
})
export class FilterComponent implements OnInit {

  public filterFormGroup: FormGroup;
  @Input() route: string;
  @Input() songs: Song[];
  public types = SongService.TYPES;
  public legalType = SongService.LEGAL_TYPE;
  public keys = KEYS;

  constructor(private router: Router, activatedRoute: ActivatedRoute, fb: FormBuilder) {
    this.filterFormGroup = fb.group({
      q: '',
      type: '',
      key: '',
      legalType: '',
      flag: '',
    });

    activatedRoute.queryParams.subscribe((filterValues: FilterValues) => {
      if (filterValues.q) this.filterFormGroup.controls.q.setValue(filterValues.q);
      if (filterValues.type) this.filterFormGroup.controls.type.setValue(filterValues.type);
      if (filterValues.key) this.filterFormGroup.controls.key.setValue(filterValues.key);
      if (filterValues.legalType) this.filterFormGroup.controls.legalType.setValue(filterValues.legalType);
      if (filterValues.flag) this.filterFormGroup.controls.flag.setValue(filterValues.flag);
    })

    this.filterFormGroup.controls.q.valueChanges.subscribe(_ => this.filerValueChanged('q', _));
    this.filterFormGroup.controls.key.valueChanges.subscribe(_ => this.filerValueChanged('key', _));
    this.filterFormGroup.controls.type.valueChanges.subscribe(_ => this.filerValueChanged('type', _));
    this.filterFormGroup.controls.legalType.valueChanges.subscribe(_ => this.filerValueChanged('legalType', _));
    this.filterFormGroup.controls.flag.valueChanges.subscribe(_ => this.filerValueChanged('flag', _));

  }

  ngOnInit(): void {
  }

  public getFlags(): string[] {
    const flags = this.songs
      .map(_ => _.flags)
      .filter(_ => !!_)
      .map(_ => _.split(';'))
      .reduce((pn, u) => [...pn, ...u], [])
      .filter(_ => !!_);

    const uqFlags = flags.filter((n, i) => flags.indexOf(n) === i);

    return uqFlags;
  }

  private async filerValueChanged(key: string, value: string): Promise<void> {
    const route = this.router.createUrlTree([this.route], {queryParams: {[key]: value}, queryParamsHandling: 'merge'});
    await this.router.navigateByUrl(route);
  }
}
