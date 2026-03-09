import {TestBed} from '@angular/core/testing';
import {of} from 'rxjs';
import {UserService} from './user.service';
import {UserSessionService} from './user-session.service';
import {UserSongUsageService} from './user-song-usage.service';

describe('UserService', () => {
  let service: UserService;
  let sessionSpy: jasmine.SpyObj<UserSessionService>;
  let songUsageSpy: jasmine.SpyObj<UserSongUsageService>;

  beforeEach(() => {
    sessionSpy = jasmine.createSpyObj<UserSessionService>(
      'UserSessionService',
      ['currentUser', 'getUserbyId', 'getUserbyId$', 'login', 'loggedIn$', 'list$', 'logout', 'update$', 'changePassword', 'createNewUser'],
      {
        users$: of([{id: 'user-1'}]) as never,
        userId$: of('user-1'),
        user$: of({id: 'user-1'}) as never,
      }
    );
    songUsageSpy = jasmine.createSpyObj<UserSongUsageService>('UserSongUsageService', ['incSongCount', 'decSongCount', 'rebuildSongUsage']);

    sessionSpy.currentUser.and.resolveTo({id: 'user-1'} as never);
    sessionSpy.getUserbyId.and.resolveTo({id: 'user-2'} as never);
    sessionSpy.getUserbyId$.and.returnValue(of({id: 'user-2'}) as never);
    sessionSpy.login.and.resolveTo('user-1');
    sessionSpy.loggedIn$.and.returnValue(of(true));
    sessionSpy.list$.and.returnValue(of([{id: 'user-1'}]) as never);
    sessionSpy.logout.and.resolveTo();
    sessionSpy.update$.and.resolveTo();
    sessionSpy.changePassword.and.resolveTo();
    sessionSpy.createNewUser.and.resolveTo();
    songUsageSpy.incSongCount.and.resolveTo();
    songUsageSpy.decSongCount.and.resolveTo();
    songUsageSpy.rebuildSongUsage.and.resolveTo({usersProcessed: 1, showsProcessed: 2, showSongsProcessed: 3});

    void TestBed.configureTestingModule({
      providers: [
        {provide: UserSessionService, useValue: sessionSpy},
        {provide: UserSongUsageService, useValue: songUsageSpy},
      ],
    });

    service = TestBed.inject(UserService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should expose the session streams directly', done => {
    service.userId$.subscribe(userId => {
      expect(userId).toBe('user-1');
      service.user$.subscribe(user => {
        expect(user).toEqual({id: 'user-1'} as never);
        service.users$.subscribe(users => {
          expect(users).toEqual([{id: 'user-1'}] as never);
          done();
        });
      });
    });
  });

  it('should delegate session operations to UserSessionService', async () => {
    await expectAsync(service.currentUser()).toBeResolvedTo({id: 'user-1'} as never);
    await expectAsync(service.getUserbyId('user-2')).toBeResolvedTo({id: 'user-2'} as never);
    await expectAsync(service.login('mail', 'secret')).toBeResolvedTo('user-1');
    await service.logout();
    await service.update$('user-1', {name: 'Benjamin'} as never);
    await service.changePassword('mail');
    await service.createNewUser('mail', 'Benjamin', 'secret');

    expect(sessionSpy.currentUser).toHaveBeenCalled();
    expect(sessionSpy.getUserbyId).toHaveBeenCalledWith('user-2');
    expect(sessionSpy.login).toHaveBeenCalledWith('mail', 'secret');
    expect(sessionSpy.logout).toHaveBeenCalled();
    expect(sessionSpy.update$).toHaveBeenCalledWith('user-1', {name: 'Benjamin'} as never);
    expect(sessionSpy.changePassword).toHaveBeenCalledWith('mail');
    expect(sessionSpy.createNewUser).toHaveBeenCalledWith('mail', 'Benjamin', 'secret');
  });

  it('should delegate user lookup and loggedIn/list streams to UserSessionService', done => {
    service.getUserbyId$('user-2').subscribe(user => {
      expect(user).toEqual({id: 'user-2'} as never);
      service.loggedIn$().subscribe(loggedIn => {
        expect(loggedIn).toBeTrue();
        service.list$().subscribe(users => {
          expect(users).toEqual([{id: 'user-1'}] as never);
          expect(sessionSpy.getUserbyId$).toHaveBeenCalledWith('user-2');
          expect(sessionSpy.loggedIn$).toHaveBeenCalled();
          expect(sessionSpy.list$).toHaveBeenCalled();
          done();
        });
      });
    });
  });

  it('should delegate song usage operations to UserSongUsageService', async () => {
    await service.incSongCount('song-1');
    await service.decSongCount('song-2');
    await expectAsync(service.rebuildSongUsage()).toBeResolvedTo({usersProcessed: 1, showsProcessed: 2, showSongsProcessed: 3});

    expect(songUsageSpy.incSongCount).toHaveBeenCalledWith('song-1');
    expect(songUsageSpy.decSongCount).toHaveBeenCalledWith('song-2');
    expect(songUsageSpy.rebuildSongUsage).toHaveBeenCalled();
  });
});
