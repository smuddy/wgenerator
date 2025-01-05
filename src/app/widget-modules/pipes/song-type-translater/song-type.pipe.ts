import {Pipe, PipeTransform} from '@angular/core';
import {SongType} from '../../../modules/songs/services/song.service';

@Pipe({
  name: 'songType',
})
export class SongTypePipe implements PipeTransform {
  public transform(songTypeKey: SongType): string {
    switch (songTypeKey) {
      case 'Worship':
        return 'Anbetung';
      case 'Praise':
        return 'Lobpreis';
      case 'Misc':
        return 'sonstiges';
      default:
        return '';
    }
  }
}
