import {Pipe, PipeTransform} from '@angular/core';
import {SectionType} from '../../../modules/songs/services/text-rendering.service';

@Pipe({
  name: 'sectionType'
})
export class SectionTypePipe implements PipeTransform {

  transform(value: SectionType): string {
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
