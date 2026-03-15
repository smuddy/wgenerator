import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'sortBy',
})
export class SortByPipe implements PipeTransform {
  public transform<T>(value: T[] | null, order: 'asc' | 'desc' = 'asc', column = ''): T[] | null {
    if (!value || !order) {
      return value;
    } // no array
    if (!column || column === '') {
      if (order === 'asc') {
        return [...value].sort();
      } else {
        return [...value].sort().reverse();
      }
    } // sort 1d array
    if (value.length <= 1) {
      return value;
    } // array with only one item
    return [...value].sort((left, right) => {
      const leftValue = this.getComparableValue(left, column);
      const rightValue = this.getComparableValue(right, column);
      const result = leftValue < rightValue ? -1 : leftValue > rightValue ? 1 : 0;
      return order === 'asc' ? result : -result;
    });
  }

  private getComparableValue<T>(item: T, column: string): string | number {
    const value = (item as Record<string, unknown>)[column];
    if (value instanceof Date) {
      return value.getTime();
    }

    switch (typeof value) {
      case 'number':
        return value;
      case 'string':
        return value;
      case 'boolean':
        return value ? 1 : 0;
      default:
        return '';
    }
  }
}
