import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'showType'
})
export class ShowTypePipe implements PipeTransform {

  transform(type: string): string {
    switch (type) {
      case  'worship':
        return 'Gottesdienst Anbetung';
      case 'praise':
        return 'Gottesdienst Lobpreis';
      case 'homegroup':
        return 'Hauskreis';
      case  'prayergroup':
        return 'Gebetskreis';
    }
    ;
  }

}
