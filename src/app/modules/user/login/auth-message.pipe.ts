import {Pipe, PipeTransform} from '@angular/core';

@Pipe({name: 'authMessage'})
export class AuthMessagePipe implements PipeTransform {
  public transform(code: string): string {
    switch (code) {
      case 'auth/user-not-found':
        return 'Benutzer wurde nicht gefunden';
      case 'auth/wrong-password':
        return 'Passwort ist falsch';
      case 'auth/email-already-in-use':
        return 'Die E-Mail-Adresse wird bereits verwendet';
      case 'auth/invalid-email':
        return 'Die E-Mail-Adresse ist ungueltig';
      case 'auth/weak-password':
        return 'Das Passwort ist zu schwach';
      case 'unknown_error':
        return 'Unbekannter Fehler';
      default:
        return code;
    }
  }
}
