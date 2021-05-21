import {Pipe, PipeTransform} from '@angular/core';
import {SectionType} from '../../../modules/songs/services/section-type';

@Pipe({
  name: 'sectionType',
})
export class SectionTypePipe implements PipeTransform {
  public transform(value: SectionType): string {
    switch (value) {
      case SectionType.Verse:
        return 'Strophe';
      case SectionType.Chorus:
        return 'Refrain';
      case SectionType.Bridge:
        return 'Bridge';
    }
  }
}
