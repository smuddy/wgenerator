import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'publishedType',
})
export class PublishedTypePipe implements PipeTransform {
  public transform(published: boolean): string {
    return published ? 'veröffentlicht' : 'unveröffentlicht';
  }
}
