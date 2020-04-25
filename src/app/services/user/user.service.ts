import {Injectable} from '@angular/core';
import {AngularFireAuth} from '@angular/fire/auth';
import {BehaviorSubject, Observable} from 'rxjs';
import {filter, first, switchMap} from 'rxjs/operators';
import {User} from './user';
import {DbService} from '../db.service';
import {environment} from '../../../environments/environment';
import {Router} from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(private afAuth: AngularFireAuth, private db: DbService, private router: Router) {
    this.afAuth.authState.pipe(
      filter(_ => !!_),
      switchMap(auth => this.readUser$(auth.uid)),
    ).subscribe(_ => this._user$.next(_));
  }

  public getUserbyId(userId: string): Promise<User> {
    return this.db.doc$<User>('users/' + userId).pipe(first()).toPromise();
  }

  public async login(user: string, password: string): Promise<any> {
    const aUser = await this.afAuth.auth.signInWithEmailAndPassword(user, password);
    const dUser = await this.readUser(aUser.user.uid);
    this._user$.next(dUser);
  }

  private _user$ = new BehaviorSubject<User>(null);

  public get user$(): Observable<User> {
    return this._user$.pipe(filter(_ => !!_));
  }

  public loggedIn$ = () => this.afAuth.authState;

  public list$ = (): Observable<User[]> => this.db.col$('users');

  public async logout(): Promise<any> {
    await this.afAuth.auth.signOut();
    this._user$.next(null);
  }

  public async update$(uid: string, data: Partial<User>): Promise<void> {
    await this.db.doc<User>('users/' + uid).update(data);
  }

  public async changePassword(user: string): Promise<any> {
    const url = environment.url;
    await this.afAuth.auth.sendPasswordResetEmail(user, {url});
  }

  public async createNewUser(user: string, name: string, password: string): Promise<any> {
    const aUser = await this.afAuth.auth.createUserWithEmailAndPassword(user, password);
    const userId = aUser.user.uid;
    await this.db.doc('users/' + userId).set({name, chordMode: 'onlyFirst'});
    const dUser = await this.readUser(aUser.user.uid);
    this._user$.next(dUser);
    await this.router.navigateByUrl('/user/info');
  }

  private readUser$ = (uid) => this.db.doc$<User>('users/' + uid);

  private async readUser(uid): Promise<User> {
    return await this.readUser$(uid).pipe(first()).toPromise();
  }
}
