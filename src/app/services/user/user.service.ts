import {Injectable} from '@angular/core';
import {AngularFireAuth} from '@angular/fire/auth';
import {BehaviorSubject, Observable} from 'rxjs';
import {filter, first, switchMap, tap} from 'rxjs/operators';
import {User} from './user';
import {DbService} from '../db.service';
import {environment} from '../../../environments/environment';
import {Router} from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private iUserId$ = new BehaviorSubject<string>(null);
  private iUser$ = new BehaviorSubject<User>(null);

  public constructor(private afAuth: AngularFireAuth, private db: DbService, private router: Router) {
    this.afAuth.authState
      .pipe(
        filter(_ => !!_),
        tap(auth => this.iUserId$.next(auth.uid)),
        switchMap(auth => this.readUser$(auth.uid))
      )
      .subscribe(_ => this.iUser$.next(_));
  }

  public get userId$(): Observable<string> {
    return this.iUserId$.asObservable();
  }

  public get user$(): Observable<User> {
    return this.iUser$.pipe(filter(_ => !!_));
  }

  public async currentUser(): Promise<User> {
    return this.user$.pipe(first()).toPromise();
  }

  public getUserbyId(userId: string): Promise<User> {
    return this.getUserbyId$(userId).pipe(first()).toPromise();
  }

  public getUserbyId$(userId: string): Observable<User> {
    return this.db.doc$<User>('users/' + userId);
  }

  public async login(user: string, password: string): Promise<string> {
    const aUser = await this.afAuth.signInWithEmailAndPassword(user, password);
    const dUser = await this.readUser(aUser.user.uid);
    this.iUser$.next(dUser);
    this.iUserId$.next(aUser.user.uid);
    return aUser.user.uid;
  }

  public loggedIn$: () => Observable<firebase.User | null> = () => this.afAuth.authState;

  public list$: () => Observable<User[]> = (): Observable<User[]> => this.db.col$('users');

  public async logout(): Promise<void> {
    await this.afAuth.signOut();
    this.iUser$.next(null);
    this.iUserId$.next(null);
  }

  public async update$(uid: string, data: Partial<User>): Promise<void> {
    await this.db.doc<User>('users/' + uid).update(data);
  }

  public async changePassword(user: string): Promise<void> {
    const url = environment.url;
    await this.afAuth.sendPasswordResetEmail(user, {url});
  }

  public async createNewUser(user: string, name: string, password: string): Promise<void> {
    const aUser = await this.afAuth.createUserWithEmailAndPassword(user, password);
    const userId = aUser.user.uid;
    await this.db.doc('users/' + userId).set({name, chordMode: 'onlyFirst'});
    const dUser = await this.readUser(aUser.user.uid);
    this.iUser$.next(dUser);
    await this.router.navigateByUrl('/brand/new-user');
  }

  private readUser$ = (uid: string) => this.db.doc$<User>('users/' + uid);
  private readUser = async (uid: string): Promise<User> => await this.readUser$(uid).pipe(first()).toPromise();
}
