import {Component, Input, inject} from '@angular/core';
import {KeyValue} from '@angular/common';
import {ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup} from '@angular/forms';
import {FilterValues} from './filter-values';
import {Show} from '../../services/show';
import {ShowService} from '../../services/show.service';
import {distinctUntilChanged, map, switchMap} from 'rxjs/operators';
import {combineLatest, Observable, of} from 'rxjs';
import {dynamicSort, onlyUnique} from '../../../../services/filter.helper';
import {UserService} from '../../../../services/user/user.service';
import {FilterStoreService} from '../../../../services/filter-store.service';
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
  private showService = inject(ShowService);
  private userService = inject(UserService);
  private filterStore = inject(FilterStoreService);

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

  public constructor() {
    const fb = inject(UntypedFormBuilder);

    this.filterFormGroup = fb.group({
      time: 1,
      owner: null,
      showType: null,
    });

    this.filterStore.showFilter$.subscribe(filterValues => {
      this.filterFormGroup.patchValue(
        {
          time: filterValues.time,
          owner: filterValues.owner || null,
          showType: filterValues.showType || null,
        },
        {emitEvent: false}
      );
    });

    this.filterFormGroup.controls.time.valueChanges.subscribe(_ => this.filterValueChanged('time', (_ as number) ?? 1));
    this.filterFormGroup.controls.owner.valueChanges.subscribe(_ => this.filterValueChanged('owner', (_ as string | null) ?? ''));
    this.filterFormGroup.controls.showType.valueChanges.subscribe(_ => this.filterValueChanged('showType', (_ as string | null) ?? ''));

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
      distinctUntilChanged((left, right) => this.sameOwners(left, right)),
      map(_ => _ as {key: string; value: string}[])
    );
  };

  private filterValueChanged<T>(key: keyof FilterValues, value: T): void {
    this.filterStore.updateShowFilter({[key]: value} as Partial<FilterValues>);
  }

  private sameOwners(left: {key: string; value: string}[], right: {key: string; value: string}[]): boolean {
    if (left.length !== right.length) {
      return false;
    }

    return left.every((owner, index) => owner.key === right[index]?.key && owner.value === right[index]?.value);
  }
}
