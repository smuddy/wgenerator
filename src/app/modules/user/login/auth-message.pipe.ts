import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'authMessage'
})
export class AuthMessagePipe implements PipeTransform {

  transform(code: string): string {
    switch (code) {
      case 'auth/user-not-found':
        return 'Benutzer wurde nicht gefunden';
      case 'auth/wrong-password':
        return 'Passwort ist falsch';
      default :
        return code;
    }
  }

}
