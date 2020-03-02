import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'role'
})
export class RolePipe implements PipeTransform {

  transform(role: 'admin'): string {
    switch (role) {
      case 'admin':
        return 'Administrator';
    }
  }

}
