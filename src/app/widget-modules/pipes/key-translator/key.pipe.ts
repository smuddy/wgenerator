import {Pipe, PipeTransform} from '@angular/core';
import {scaleMapping} from '../../../modules/songs/services/key.helper';

@Pipe({
  name: 'key'
})
export class KeyPipe implements PipeTransform {

  transform(key: string): string {
    return scaleMapping[key];
  }

}
