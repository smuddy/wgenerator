import {Injectable, inject} from '@angular/core';
import {Observable} from 'rxjs';
import {User} from './user';
import {UserSongUsageService} from './user-song-usage.service';
import {UserSessionService} from './user-session.service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private session = inject(UserSessionService);
  private songUsage = inject(UserSongUsageService);

  public users$ = this.session.users$;

  public get userId$(): Observable<string | null> {
    return this.session.userId$;
  }

  public get user$(): Observable<User | null> {
    return this.session.user$;
  }

  public currentUser = (): Promise<User | null> => this.session.currentUser();
  public getUserbyId = (userId: string): Promise<User | null> => this.session.getUserbyId(userId);
  public getUserbyId$ = (userId: string): Observable<User | null> => this.session.getUserbyId$(userId);
  public login = (user: string, password: string): Promise<string | null> => this.session.login(user, password);
  public loggedIn$ = (): Observable<boolean> => this.session.loggedIn$();
  public list$ = (): Observable<User[]> => this.session.list$();
  public logout = (): Promise<void> => this.session.logout();
  public update$ = (uid: string, data: Partial<User>): Promise<void> => this.session.update$(uid, data);
  public changePassword = (user: string): Promise<void> => this.session.changePassword(user);
  public createNewUser = (user: string, name: string, password: string): Promise<void> => this.session.createNewUser(user, name, password);
  public incSongCount = (songId: string): Promise<void | null> => this.songUsage.incSongCount(songId);
  public decSongCount = (songId: string): Promise<void | null> => this.songUsage.decSongCount(songId);
}
