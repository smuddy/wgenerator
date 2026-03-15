import {EnvironmentInjector, Injectable, inject, runInInjectionContext} from '@angular/core';
import {Auth, authState, createUserWithEmailAndPassword, sendPasswordResetEmail, signInWithEmailAndPassword, signOut} from '@angular/fire/auth';
import {User as AuthUser} from 'firebase/auth';
import {firstValueFrom, Observable, of} from 'rxjs';
import {filter, map, shareReplay, switchMap, take} from 'rxjs/operators';
import {DbService} from '../db.service';
import {environment} from '../../../environments/environment';
import {Router} from '@angular/router';
import {User} from './user';

@Injectable({
  providedIn: 'root',
})
export class UserSessionService {
  private auth = inject(Auth);
  private db = inject(DbService);
  private router = inject(Router);
  private environmentInjector = inject(EnvironmentInjector);

  private authStateChanges$ = this.createAuthState$().pipe(shareReplay({bufferSize: 1, refCount: true}));
  public users$ = this.db.col$<User>('users').pipe(shareReplay({bufferSize: 1, refCount: true}));
  private userByIdCache = new Map<string, Observable<User | null>>();
  private iUserId$ = this.authStateChanges$.pipe(
    map(auth => auth?.uid ?? null),
    shareReplay({bufferSize: 1, refCount: true})
  );
  private iUser$ = this.iUserId$.pipe(
    switchMap(uid => (uid ? this.readUser$(uid) : of(null))),
    shareReplay({bufferSize: 1, refCount: true})
  );

  public get userId$(): Observable<string | null> {
    return this.iUserId$;
  }

  public get user$(): Observable<User | null> {
    return this.iUser$;
  }

  public currentUser = async (): Promise<User | null> => firstValueFrom(this.user$);
  public loggedIn$ = (): Observable<boolean> => this.authStateChanges$.pipe(map(auth => !!auth));
  public list$ = (): Observable<User[]> => this.users$;

  public getUserbyId = (userId: string): Promise<User | null> => firstValueFrom(this.getUserbyId$(userId));
  public getUserbyId$ = (userId: string): Observable<User | null> => {
    const cached = this.userByIdCache.get(userId);
    if (cached) {
      return cached;
    }

    const user$ = this.db.doc$<User>(`users/${userId}`).pipe(shareReplay({bufferSize: 1, refCount: true}));
    this.userByIdCache.set(userId, user$);
    return user$;
  };

  public async login(user: string, password: string): Promise<string | null> {
    const aUser = await this.runInFirebaseContext(() => signInWithEmailAndPassword(this.auth, user, password));
    if (!aUser.user) return null;
    const dUser = await this.readUser(aUser.user.uid);
    if (!dUser) return null;
    await this.initSongUsage(dUser);
    await this.awaitAuthenticatedUser(aUser.user.uid);

    return aUser.user.uid;
  }

  public async logout(): Promise<void> {
    await this.runInFirebaseContext(() => signOut(this.auth));
  }

  public async update$(uid: string, data: Partial<User>): Promise<void> {
    await this.db.doc<User>('users/' + uid).update(data);
  }

  public async changePassword(user: string): Promise<void> {
    await this.runInFirebaseContext(() => sendPasswordResetEmail(this.auth, user, {url: environment.url}));
  }

  public async createNewUser(user: string, name: string, password: string): Promise<void> {
    const aUser = await this.runInFirebaseContext(() => createUserWithEmailAndPassword(this.auth, user, password));
    if (!aUser.user) return;
    const userId = aUser.user.uid;
    await this.db.doc('users/' + userId).set({name, chordMode: 'onlyFirst', songUsage: {}});
    const dUser = await this.readUser(aUser.user.uid);
    if (!dUser) return;
    await this.router.navigateByUrl('/brand/new-user');
  }

  private async initSongUsage(user: User) {
    if (user.songUsage) return;
    await this.update$(user.id, {songUsage: {}});
  }

  private async awaitAuthenticatedUser(uid: string): Promise<void> {
    await firstValueFrom(
      this.user$.pipe(
        filter((user): user is User => !!user && user.id === uid),
        take(1)
      )
    );
  }

  private runInFirebaseContext = <T>(factory: () => T): T => runInInjectionContext(this.environmentInjector, factory);
  private readUser$ = (uid: string) => this.db.doc$<User>('users/' + uid);
  private readUser = (uid: string): Promise<User | null> => firstValueFrom(this.readUser$(uid));
  private createAuthState$(): Observable<AuthUser | null> {
    return runInInjectionContext(this.environmentInjector, () => authState(this.auth));
  }
}
