import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'songType'
})
export class SongTypePipe implements PipeTransform {

  transform(songTypeKey: string): string {
    switch (songTypeKey) {
      case 'Worship':
        return 'Anbetung';
      case 'Praise':
        return 'Lobpreis';
      default:
        return ''
    }
  }

}
