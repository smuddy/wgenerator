import {Injectable} from '@angular/core';
import {AngularFireAuth} from '@angular/fire/auth';
import {Observable} from 'rxjs';
import {filter, switchMap} from 'rxjs/operators';
import {User} from './user';
import {AngularFirestore} from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(private afAuth: AngularFireAuth, private afs: AngularFirestore) {
  }

  public get user$(): Observable<User> {
    return this.afAuth.authState.pipe(
      filter(_ => !!_),
      switchMap(auth => this.afs.doc<User>('user/' + auth.uid).valueChanges())
    );
  }
}
