import {Component, Input} from '@angular/core';
import {KeyValue} from '@angular/common';
import {ActivatedRoute, Router} from '@angular/router';
import {UntypedFormBuilder, UntypedFormGroup} from '@angular/forms';
import {FilterValues} from './filter-values';
import {Show} from '../../services/show';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.less'],
})
export class FilterComponent {
  @Input() public route = '/shows/';
  @Input() public shows: Show[] = [];

  public filterFormGroup: UntypedFormGroup;
  public times: KeyValue<number, string>[] = [
    {key: 1, value: 'letzter Monat'},
    {key: 3, value: 'letztes Quartal'},
    {key: 12, value: 'letztes Jahr'},
    {key: 99999, value: 'alle'},
  ];

  public constructor(private router: Router, activatedRoute: ActivatedRoute, fb: UntypedFormBuilder) {
    this.filterFormGroup = fb.group({
      time: 1,
    });

    activatedRoute.queryParams.subscribe(params => {
      const filterValues = params as FilterValues;
      if (filterValues.time) this.filterFormGroup.controls.time.setValue(+filterValues.time);
    });

    this.filterFormGroup.controls.time.valueChanges.subscribe(_ => void this.filerValueChanged('time', _ as number));
  }

  private async filerValueChanged<T>(key: string, value: T): Promise<void> {
    const route = this.router.createUrlTree([this.route], {
      queryParams: {[key]: value},
      queryParamsHandling: 'merge',
    });
    await this.router.navigateByUrl(route);
  }
}
