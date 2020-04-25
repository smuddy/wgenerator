import {Pipe, PipeTransform} from '@angular/core';
import {roles} from '../../../services/user/roles';


@Pipe({
  name: 'role'
})
export class RolePipe implements PipeTransform {

  transform(role: roles): string {
    switch (role) {
      case 'distributor':
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
