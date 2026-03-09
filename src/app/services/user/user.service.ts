import {Injectable} from '@angular/core';
import {Auth, authState, createUserWithEmailAndPassword, sendPasswordResetEmail, signInWithEmailAndPassword, signOut} from '@angular/fire/auth';
import {BehaviorSubject, firstValueFrom, Observable} from 'rxjs';
import {filter, map, shareReplay, switchMap, take, tap} from 'rxjs/operators';
import {User} from './user';
import {DbService} from '../db.service';
import {environment} from '../../../environments/environment';
import {Router} from '@angular/router';
import {ShowDataService} from '../../modules/shows/services/show-data.service';
import {ShowSongDataService} from '../../modules/shows/services/show-song-data.service';
import {increment} from '@angular/fire/firestore';

export interface SongUsageMigrationResult {
  usersProcessed: number;
  showsProcessed: number;
  showSongsProcessed: number;
}

@Injectable({
  providedIn: 'root',
})
export class UserService {
  public users$ = this.db.col$<User>('users').pipe(shareReplay({bufferSize: 1, refCount: true}));
  private iUserId$ = new BehaviorSubject<string | null>(null);
  private iUser$ = new BehaviorSubject<User | null>(null);
  private userByIdCache = new Map<string, Observable<User | null>>();

  public constructor(
    private auth: Auth,
    private db: DbService,
    private router: Router,
    private showDataService: ShowDataService,
    private showSongDataService: ShowSongDataService
  ) {
    authState(this.auth)
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

  public currentUser = async (): Promise<User | null> => firstValueFrom(this.user$);

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
    const aUser = await signInWithEmailAndPassword(this.auth, user, password);
    if (!aUser.user) return null;
    const dUser = await this.readUser(aUser.user.uid);
    if (!dUser) return null;
    await this.initSongUsage(dUser);
    this.iUser$.next(dUser);
    this.iUserId$.next(aUser.user.uid);

    return aUser.user.uid;
  }

  public loggedIn$: () => Observable<boolean> = () => authState(this.auth).pipe(map(_ => !!_));

  public list$: () => Observable<User[]> = (): Observable<User[]> => this.users$;

  public async logout(): Promise<void> {
    await signOut(this.auth);
    this.iUser$.next(null);
    this.iUserId$.next(null);
  }

  public async update$(uid: string, data: Partial<User>): Promise<void> {
    await this.db.doc<User>('users/' + uid).update(data);
  }

  public async changePassword(user: string): Promise<void> {
    const url = environment.url;
    await sendPasswordResetEmail(this.auth, user, {url});
  }

  public async createNewUser(user: string, name: string, password: string): Promise<void> {
    const aUser = await createUserWithEmailAndPassword(this.auth, user, password);
    if (!aUser.user) return;
    const userId = aUser.user.uid;
    await this.db.doc('users/' + userId).set({name, chordMode: 'onlyFirst', songUsage: {}});
    const dUser = await this.readUser(aUser.user.uid);
    if (!dUser) return;
    this.iUser$.next(dUser);
    await this.router.navigateByUrl('/brand/new-user');
  }

  public incSongCount = (songId: string) => this.updateSongUsage(songId, 1);
  public decSongCount = (songId: string) => this.updateSongUsage(songId, -1);

  public async rebuildSongUsage(): Promise<SongUsageMigrationResult> {
    const currentUser = await firstValueFrom(this.iUser$.pipe(take(1)));
    if (!currentUser || !this.hasAdminRole(currentUser.role)) {
      throw new Error('Admin role required to rebuild songUsage.');
    }

    const [users, shows] = await Promise.all([firstValueFrom(this.users$), firstValueFrom(this.showDataService.listRaw$())]);
    const songUsageByUserId: Record<string, Record<string, number>> = {};

    users.forEach(user => {
      songUsageByUserId[user.id] = {};
    });

    let showSongsProcessed = 0;
    for (const show of shows) {
      const ownerId = show.owner;
      if (!ownerId) {
        continue;
      }

      const showSongs = await firstValueFrom(this.showSongDataService.list$(show.id));
      const usage = songUsageByUserId[ownerId] ?? {};
      songUsageByUserId[ownerId] = usage;

      for (const showSong of showSongs) {
        showSongsProcessed += 1;
        usage[showSong.songId] = (usage[showSong.songId] ?? 0) + 1;
      }
    }

    await Promise.all(
      users.map(user =>
        this.update$(user.id, {
          songUsage: songUsageByUserId[user.id] ?? {},
        })
      )
    );

    return {
      usersProcessed: users.length,
      showsProcessed: shows.length,
      showSongsProcessed,
    };
  }

  private async updateSongUsage(songId: string, direction: number) {
    const user = await firstValueFrom(this.user$);
    if (!user) return null;

    await this.db.doc<User>('users/' + user.id).update({
      [`songUsage.${songId}`]: increment(direction),
    });
  }

  private async initSongUsage(user: User) {
    if (user.songUsage) return;
    await this.update$(user.id, {songUsage: {}});
  }

  private hasAdminRole(role: string | null | undefined): boolean {
    if (!role) {
      return false;
    }

    return role.split(';').includes('admin');
  }

  private readUser$ = (uid: string) => this.db.doc$<User>('users/' + uid);
  private readUser: (uid: string) => Promise<User | null> = (uid: string) => firstValueFrom(this.readUser$(uid));
}
