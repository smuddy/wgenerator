import {Pipe, PipeTransform} from '@angular/core';
import {SongLegalOwner} from '../../../modules/songs/services/song.service';

@Pipe({
  name: 'legalOwner',
})
export class LegalOwnerPipe implements PipeTransform {
  public transform(legalOwnerKey: SongLegalOwner): string {
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
