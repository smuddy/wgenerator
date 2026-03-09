import {Component, Input} from '@angular/core';
import {KeyValue} from '@angular/common';
import {ActivatedRoute, Router} from '@angular/router';
import {ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup} from '@angular/forms';
import {FilterValues} from './filter-values';
import {Show} from '../../services/show';
import {ShowService} from '../../services/show.service';
import {distinctUntilChanged, map, switchMap} from 'rxjs/operators';
import {combineLatest, Observable, of} from 'rxjs';
import {dynamicSort, onlyUnique} from '../../../../services/filter.helper';
import {UserService} from '../../../../services/user/user.service';
import {isEqual} from 'lodash';
import {MatFormField, MatLabel} from '@angular/material/form-field';
import {MatSelect} from '@angular/material/select';
import {MatOptgroup, MatOption} from '@angular/material/core';
import {ShowTypePipe} from '../../../../widget-modules/pipes/show-type-translater/show-type.pipe';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.less'],
  imports: [ReactiveFormsModule, MatFormField, MatLabel, MatSelect, MatOption, MatOptgroup, ShowTypePipe],
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
      this.filterFormGroup.controls.owner.setValue(filterValues.owner ?? null, {emitEvent: false});
      this.filterFormGroup.controls.showType.setValue(filterValues.showType ?? null, {emitEvent: false});
    });

    this.filterFormGroup.controls.time.valueChanges.subscribe(_ => void this.filerValueChanged('time', _ as number));
    this.filterFormGroup.controls.owner.valueChanges.subscribe(_ => void this.filerValueChanged('owner', _ as string));
    this.filterFormGroup.controls.showType.valueChanges.subscribe(_ => void this.filerValueChanged('showType', _ as string));

    this.owners$().subscribe(owners => (this.owners = owners));
  }

  public owners$ = (): Observable<{key: string; value: string}[]> => {
    return this.showService.list$().pipe(
      map(shows =>
        shows
          .map(show => show.owner)
          .filter(onlyUnique)
          .filter((ownerId): ownerId is string => !!ownerId)
      ),
      switchMap(ownerIds => {
        if (ownerIds.length === 0) {
          return of([] as {key: string; value: string}[]);
        }

        return combineLatest(
          ownerIds.map(ownerId =>
            this.userService.getUserbyId$(ownerId).pipe(
              map(user => ({
                key: ownerId,
                value: user?.name,
              }))
            )
          )
        );
      }),
      map(owners => {
        return owners.sort(dynamicSort('value'));
      }),
      distinctUntilChanged(isEqual),
      map(_ => _ as {key: string; value: string}[])
    );
  };

  private async filerValueChanged<T>(key: string, value: T): Promise<void> {
    const route = this.router.createUrlTree([this.route], {
      queryParams: {[key]: value || null},
      queryParamsHandling: 'merge',
    });
    await this.router.navigateByUrl(route);
  }
}
