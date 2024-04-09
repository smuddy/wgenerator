import {Component, Input} from '@angular/core';
import {KeyValue} from '@angular/common';
import {ActivatedRoute, Router} from '@angular/router';
import {UntypedFormBuilder, UntypedFormGroup} from '@angular/forms';
import {FilterValues} from './filter-values';
import {Show} from '../../services/show';
import {ShowService} from '../../services/show.service';
import {distinctUntilChanged, map} from 'rxjs/operators';
import {combineLatest, Observable} from 'rxjs';
import {dynamicSort, onlyUnique} from '../../../../services/filter.helper';
import {UserService} from '../../../../services/user/user.service';
import {isEqual} from 'lodash';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.less'],
})
export class FilterComponent {
  @Input() public route = '/shows/';
  @Input() public shows: Show[] = [];

  public showTypePublic = ShowService.SHOW_TYPE_PUBLIC;
  public showTypePrivate = ShowService.SHOW_TYPE_PRIVATE;

  public filterFormGroup: UntypedFormGroup;
  public times: KeyValue<number, string>[] = [
    {key: 1, value: 'letzter Monat'},
    {key: 3, value: 'letztes Quartal'},
    {key: 12, value: 'letztes Jahr'},
    {key: 99999, value: 'alle'},
  ];

  public owners: {key: string; value: string}[] = [];

  public constructor(
    private router: Router,
    private showService: ShowService,
    private userService: UserService,
    activatedRoute: ActivatedRoute,
    fb: UntypedFormBuilder
  ) {
    this.filterFormGroup = fb.group({
      time: 1,
      owner: null,
      showType: null,
    });

    activatedRoute.queryParams.subscribe(params => {
      const filterValues = params as FilterValues;
      if (filterValues.time) this.filterFormGroup.controls.time.setValue(+filterValues.time);
    });

    this.filterFormGroup.controls.time.valueChanges.subscribe(_ => void this.filerValueChanged('time', _ as number));
    this.filterFormGroup.controls.owner.valueChanges.subscribe(_ => void this.filerValueChanged('owner', _ as string));
    this.filterFormGroup.controls.showType.valueChanges.subscribe(_ => void this.filerValueChanged('showType', _ as string));

    this.owners$().subscribe(owners => (this.owners = owners));
  }

  public owners$ = (): Observable<{key: string; value: string}[]> => {
    return combineLatest([
      this.showService.list$().pipe(
        map(shows => {
          return shows.map(show => show.owner).filter(onlyUnique);
        })
      ),
      this.userService.users$,
    ]).pipe(
      map(([owners, users]) => {
        return owners
          .map(ownerId => ({
            key: ownerId,
            value: users.find(user => user.id === ownerId)?.name,
          }))
          .sort(dynamicSort('value'));
      }),
      distinctUntilChanged(isEqual),
      map(_ => _ as {key: string; value: string}[])
    );
  };

  private async filerValueChanged<T>(key: string, value: T): Promise<void> {
    const route = this.router.createUrlTree([this.route], {
      queryParams: {[key]: value},
      queryParamsHandling: 'merge',
    });
    await this.router.navigateByUrl(route);
  }
}
