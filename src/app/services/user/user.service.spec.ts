import {TestBed} from '@angular/core/testing';
import {firstValueFrom, of} from 'rxjs';
import {beforeEach, describe, expect, it, vi} from 'vitest';
import {UserService} from './user.service';
import {UserSessionService} from './user-session.service';
import {UserSongUsageService} from './user-song-usage.service';

describe('UserService', () => {
  let service: UserService;
  let sessionSpy: {
    currentUser: ReturnType<typeof vi.fn>;
    getUserbyId: ReturnType<typeof vi.fn>;
    getUserbyId$: ReturnType<typeof vi.fn>;
    login: ReturnType<typeof vi.fn>;
    loggedIn$: ReturnType<typeof vi.fn>;
    list$: ReturnType<typeof vi.fn>;
    logout: ReturnType<typeof vi.fn>;
    update$: ReturnType<typeof vi.fn>;
    changePassword: ReturnType<typeof vi.fn>;
    createNewUser: ReturnType<typeof vi.fn>;
    users$: unknown;
    userId$: unknown;
    user$: unknown;
  };
  let songUsageSpy: {incSongCount: ReturnType<typeof vi.fn>; decSongCount: ReturnType<typeof vi.fn>};

  beforeEach(async () => {
    sessionSpy = {
      currentUser: vi.fn(),
      getUserbyId: vi.fn(),
      getUserbyId$: vi.fn(),
      login: vi.fn(),
      loggedIn$: vi.fn(),
      list$: vi.fn(),
      logout: vi.fn(),
      update$: vi.fn(),
      changePassword: vi.fn(),
      createNewUser: vi.fn(),
      users$: of([{id: 'user-1'}]) as never,
      userId$: of('user-1'),
      user$: of({id: 'user-1'}) as never,
    };
    songUsageSpy = {incSongCount: vi.fn(), decSongCount: vi.fn()};

    sessionSpy.currentUser.mockResolvedValue({id: 'user-1'} as never);
    sessionSpy.getUserbyId.mockResolvedValue({id: 'user-2'} as never);
    sessionSpy.getUserbyId$.mockReturnValue(of({id: 'user-2'}) as never);
    sessionSpy.login.mockResolvedValue('user-1');
    sessionSpy.loggedIn$.mockReturnValue(of(true));
    sessionSpy.list$.mockReturnValue(of([{id: 'user-1'}]) as never);
    sessionSpy.logout.mockResolvedValue(undefined);
    sessionSpy.update$.mockResolvedValue(undefined);
    sessionSpy.changePassword.mockResolvedValue(undefined);
    sessionSpy.createNewUser.mockResolvedValue(undefined);
    songUsageSpy.incSongCount.mockResolvedValue(undefined);
    songUsageSpy.decSongCount.mockResolvedValue(undefined);

    await TestBed.configureTestingModule({
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

  it('should expose the session streams directly', async () => {
    await expect(firstValueFrom(service.userId$)).resolves.toEqual('user-1');
    await expect(firstValueFrom(service.user$)).resolves.toEqual({id: 'user-1'} as never);
    await expect(firstValueFrom(service.users$)).resolves.toEqual([{id: 'user-1'}] as never);
  });

  it('should delegate session operations to UserSessionService', async () => {
    await expect(service.currentUser()).resolves.toEqual({id: 'user-1'} as never);
    await expect(service.getUserbyId('user-2')).resolves.toEqual({id: 'user-2'} as never);
    await expect(service.login('mail', 'secret')).resolves.toEqual('user-1');
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

  it('should delegate user lookup and loggedIn/list streams to UserSessionService', async () => {
    await expect(firstValueFrom(service.getUserbyId$('user-2'))).resolves.toEqual({id: 'user-2'} as never);
    await expect(firstValueFrom(service.loggedIn$())).resolves.toEqual(true);
    await expect(firstValueFrom(service.list$())).resolves.toEqual([{id: 'user-1'}] as never);
    expect(sessionSpy.getUserbyId$).toHaveBeenCalledWith('user-2');
    expect(sessionSpy.loggedIn$).toHaveBeenCalled();
    expect(sessionSpy.list$).toHaveBeenCalled();
  });

  it('should delegate song usage operations to UserSongUsageService', async () => {
    await service.incSongCount('song-1');
    await service.decSongCount('song-2');

    expect(songUsageSpy.incSongCount).toHaveBeenCalledWith('song-1');
    expect(songUsageSpy.decSongCount).toHaveBeenCalledWith('song-2');
  });
});
