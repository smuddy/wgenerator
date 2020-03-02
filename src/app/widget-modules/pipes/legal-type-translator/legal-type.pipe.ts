import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'legalType'
})
export class LegalTypePipe implements PipeTransform {

  transform(legalTypeKey: string): string {
    switch (legalTypeKey) {
      case 'open':
        return 'Klärung erforderlich ';
      case 'allowed':
        return 'OK';
      default:
        return '';
    }
  }

}
