import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'status',
  standalone: false,
})
export class StatusPipe implements PipeTransform {
  public transform(songTypeKey: string): string {
    switch (songTypeKey) {
      case 'draft':
        return 'Entwurf';
      case 'set':
        return 'offen';
      case 'final':
        return 'final';
      default:
        return '';
    }
  }
}
