import {Pipe, PipeTransform} from '@angular/core';
import {roles} from '../../../services/user/roles';

@Pipe({
  name: 'role',
})
export class RolePipe implements PipeTransform {
  public transform(role: roles): string {
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
      case 'member':
        return 'Lobpreisgruppe';
      case 'presenter':
        return 'Präsentator';
    }

    return 'keine Rolle';
  }
}
