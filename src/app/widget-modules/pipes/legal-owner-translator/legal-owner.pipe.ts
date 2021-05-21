import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'legalOwner',
})
export class LegalOwnerPipe implements PipeTransform {
  public transform(legalOwnerKey: string): string {
    switch (legalOwnerKey) {
      case 'CCLI':
        return 'CCLI';
      case 'other':
        return 'andere';
      default:
        return '';
    }
  }
}
