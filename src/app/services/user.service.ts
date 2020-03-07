import {Injectable} from '@angular/core';
import {AngularFireAuth} from '@angular/fire/auth';
import {Observable} from 'rxjs';
import {filter, switchMap} from 'rxjs/operators';
import {User} from './user';
import {DbService} from './db.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(private afAuth: AngularFireAuth, private db: DbService) {
  }

  public get user$(): Observable<User> {
    return this.afAuth.authState.pipe(
      filter(_ => !!_),
      switchMap(auth => this.db.doc$<User>('user/' + auth.uid))
    );
  }
}
