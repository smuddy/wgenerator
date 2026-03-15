import {Pipe, PipeTransform} from '@angular/core';
import {ReportedType} from '../../../modules/shows/services/show';

@Pipe({
  name: 'reportedType',
})
export class ReportedTypePipe implements PipeTransform {
  public transform(reportedType: ReportedType): string {
    switch (reportedType) {
      case 'pending':
        return 'nicht gemeldet';
      case 'reported':
        return 'gemeldet';
      case 'not-required':
        return 'Meldung nicht notwendig';
      default:
        return '';
    }
  }
}
