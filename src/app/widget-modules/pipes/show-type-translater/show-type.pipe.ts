import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'showType',
})
export class ShowTypePipe implements PipeTransform {
  public transform(type: string): string {
    switch (type) {
      case 'service-worship':
        return 'Gottesdienst Anbetung';
      case 'service-praise':
        return 'Gottesdienst Lobpreis';
      case 'home-group-big':
        return 'Großer Hauskreis';
      case 'home-group':
        return 'Hauskreis';
      case 'prayer-group':
        return 'Gebetskreis';
      case 'teens-group':
        return 'Teeniekreis';
      case 'kids-group':
        return 'Kinderkreis';
      case 'misc-public':
        return 'Sonstige öffentliche Veranstaltung';
      case 'misc-private':
        return 'Sonstige private Veranstaltung';
    }

    return 'unbekannter Veranstaltungstyp';
  }
}
