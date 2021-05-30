import {Injectable} from '@angular/core';
import {AngularFireAuth} from '@angular/fire/auth';
import {BehaviorSubject, Observable} from 'rxjs';
import {filter, first, map, switchMap, tap} from 'rxjs/operators';
import {User} from './user';
import {DbService} from '../db.service';
import {environment} from '../../../environments/environment';
import {Router} from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private iUserId$ = new BehaviorSubject<string | null>(null);
  private iUser$ = new BehaviorSubject<User | null>(null);

  public constructor(private afAuth: AngularFireAuth, private db: DbService, private router: Router) {
    this.afAuth.authState
      .pipe(
        filter(auth => !!auth),
        map(auth => auth?.uid ?? ''),
        tap(uid => this.iUserId$.next(uid)),
        switchMap(uid => this.readUser$(uid))
      )
      .subscribe(_ => this.iUser$.next(_));
  }

  public get userId$(): Observable<string | null> {
    return this.iUserId$.asObservable();
  }

  public get user$(): Observable<User | null> {
    return this.iUser$.pipe(filter(_ => !!_));
  }

  public async currentUser(): Promise<User | null> {
    return this.user$.pipe(first()).toPromise();
  }

  public getUserbyId(userId: string): Promise<User | null> {
    return this.getUserbyId$(userId).pipe(first()).toPromise();
  }

  public getUserbyId$(userId: string): Observable<User | null> {
    return this.db.doc$<User>('users/' + userId);
  }

  public async login(user: string, password: string): Promise<string | null> {
    const aUser = await this.afAuth.signInWithEmailAndPassword(user, password);
    if (!aUser.user) return null;
    const dUser = await this.readUser(aUser.user.uid);
    this.iUser$.next(dUser);
    this.iUserId$.next(aUser.user.uid);
    return aUser.user.uid;
  }

  public loggedIn$: () => Observable<boolean> = () => this.afAuth.authState.pipe(map(_ => !!_));

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
    if (!aUser.user) return;
    const userId = aUser.user.uid;
    await this.db.doc('users/' + userId).set({name, chordMode: 'onlyFirst'});
    const dUser = await this.readUser(aUser.user.uid);
    this.iUser$.next(dUser);
    await this.router.navigateByUrl('/brand/new-user');
  }

  private readUser$ = (uid: string) => this.db.doc$<User | null>('users/' + uid);
  private readUser = async (uid: string): Promise<User | null> => await this.readUser$(uid).pipe(first()).toPromise();
}
