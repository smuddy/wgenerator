import {Pipe, PipeTransform} from '@angular/core';
import {orderBy} from 'lodash';

@Pipe({name: 'sortBy'})
export class SortByPipe implements PipeTransform {
  public transform(value: unknown[] | null, order: 'asc' | 'desc' = 'asc', column = ''): unknown[] | null {
    if (!value || !order) {
      return value;
    } // no array
    if (!column || column === '') {
      if (order === 'asc') {
        return value.sort();
      } else {
        return value.sort().reverse();
      }
    } // sort 1d array
    if (value.length <= 1) {
      return value;
    } // array with only one item
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    return orderBy(value, [column], [order]) as unknown[];
  }
}
