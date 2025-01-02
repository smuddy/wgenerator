import {Pipe, PipeTransform} from '@angular/core';
import {SongLegalType} from '../../../modules/songs/services/song.service';

@Pipe({
  name: 'legalType',
  standalone: false,
})
export class LegalTypePipe implements PipeTransform {
  public transform(legalTypeKey: SongLegalType): string {
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
