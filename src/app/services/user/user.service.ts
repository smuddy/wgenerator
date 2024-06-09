import {Injectable} from '@angular/core';
import {AngularFireAuth} from '@angular/fire/compat/auth';
import {BehaviorSubject, firstValueFrom, Observable} from 'rxjs';
import {filter, map, switchMap, tap} from 'rxjs/operators';
import {User} from './user';
import {DbService} from '../db.service';
import {environment} from '../../../environments/environment';
import {Router} from '@angular/router';
import {ShowDataService} from '../../modules/shows/services/show-data.service';
import {ShowSongDataService} from '../../modules/shows/services/show-song-data.service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private iUserId$ = new BehaviorSubject<string | null>(null);
  private iUser$ = new BehaviorSubject<User | null>(null);

  public users$ = new BehaviorSubject<User[]>([]);

  public get userId$(): Observable<string | null> {
    return this.iUserId$.asObservable();
  }

  public get user$(): Observable<User | null> {
    return this.iUser$.pipe(filter(_ => !!_));
  }

  public currentUser = async (): Promise<User | null> => firstValueFrom(this.user$);

  public constructor(
    private afAuth: AngularFireAuth,
    private db: DbService,
    private router: Router,
    private showDataService: ShowDataService,
    private showSongDataService: ShowSongDataService
  ) {
    this.afAuth.authState
      .pipe(
        filter(auth => !!auth),
        map(auth => auth?.uid ?? ''),
        tap(uid => this.iUserId$.next(uid)),
        switchMap(uid => this.readUser$(uid))
      )
      .subscribe(_ => this.iUser$.next(_));

    this.db.col$<User>('users/').subscribe(_ => this.users$.next(_));
  }
  public getUserbyId = (userId: string): Promise<User | null> => firstValueFrom(this.getUserbyId$(userId));
  public getUserbyId$ = (userId: string): Observable<User | null> => this.users$.pipe(map(_ => _.find(f => f.id === userId) || null));

  public async login(user: string, password: string): Promise<string | null> {
    const aUser = await this.afAuth.signInWithEmailAndPassword(user, password);
    if (!aUser.user) return null;
    const dUser = await this.readUser(aUser.user.uid);
    await this.initSongUsage(dUser);
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

  public incSongCount = (songId: string) => this.updateSongUsage(songId, 1);
  public decSongCount = (songId: string) => this.updateSongUsage(songId, -1);

  private async updateSongUsage(songId: string, direction: number) {
    const user = await firstValueFrom(this.user$);
    if (!user) return null;

    const songUsage = user?.songUsage ?? {};
    let currentSongCount = songUsage[songId];
    if (currentSongCount === null || currentSongCount === undefined) currentSongCount = 0;
    else currentSongCount = currentSongCount + direction;
    songUsage[songId] = Math.max(0, currentSongCount);

    await this.update$(user.id, {songUsage});
  }

  private async initSongUsage(user: User) {
    if (user.songUsage) return;

    const shows = await firstValueFrom(this.showDataService.listRaw$());
    const myShows = shows.filter(show => show.owner === user.id);
    const songUsage: {[songId: string]: number} = {};
    for (const show of myShows) {
      const showSongs = await firstValueFrom(this.showSongDataService.list$(show.id));
      for (const showSong of showSongs) {
        const current = songUsage[showSong.songId] ?? 0;
        songUsage[showSong.songId] = current + 1;
      }
    }

    await this.update$(user.id, {songUsage});
    return;
  }

  private readUser$ = (uid: string) => this.db.doc$<User>('users/' + uid);
  private readUser: (uid: string) => Promise<User | null> = (uid: string) => firstValueFrom(this.readUser$(uid));
}
