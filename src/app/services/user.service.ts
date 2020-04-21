import {Injectable} from '@angular/core';
import {AngularFireAuth} from '@angular/fire/auth';
import {BehaviorSubject, Observable} from 'rxjs';
import {filter, switchMap} from 'rxjs/operators';
import {User} from './user';
import {DbService} from './db.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(private afAuth: AngularFireAuth, private db: DbService) {
    this.afAuth.authState.pipe(
      filter(_ => !!_),
      switchMap(auth => this.db.doc$<User>('user/' + auth.uid)),
    ).subscribe(_ => this._user$.next(_));
  }

  private _user$ = new BehaviorSubject<User>(null);

  public get user$(): Observable<User> {
    return this._user$.pipe(filter(_ => !!_));
  }

  public getUserbyId$(userId: string): Observable<User> {
    return this.db.doc$<User>('user/' + userId);
  }

  public async update$(uid: string, data: Partial<User>): Promise<void> {
    await this.db.doc<User>('user/' + uid).update(data);
  }
}
