import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'role',
})
export class RolePipe implements PipeTransform {
  public transform(role: string): string {
    switch (role) {
      case 'contributor':
        return 'Mitarbeiter';
      case 'none':
        return 'keine Berechtigung';
      case 'admin':
        return 'Administrator';
      case 'user':
        return 'Benutzer';
      case 'leader':
        return 'Lobpreisleiter';
      case 'presenter':
        return 'Präsentator';
    }
  }
}
