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
        return 'großer Hauskreis';
      case 'home-group':
        return 'Hauskreis';
      case 'prayer-group':
        return 'Gebetskreis';
      case 'teens-group':
        return 'Teeniekreis';
      case 'kids-group':
        return 'Kinderkreis';
      case 'misc-public':
        return 'sonstige öffentliche Veranstaltung';
      case 'misc-private':
        return 'sonstige private Veranstaltung';
    }

    return 'unbekannter Veranstaltungstyp';
  }
}
