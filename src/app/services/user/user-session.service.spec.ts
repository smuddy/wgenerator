import {TestBed} from '@angular/core/testing';
import {Router} from '@angular/router';
import {BehaviorSubject, firstValueFrom, of} from 'rxjs';
import {Auth} from '@angular/fire/auth';
import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest';
import {DbService} from '../db.service';
import {UserSessionService} from './user-session.service';

describe('UserSessionService', () => {
  let service: UserSessionService;
  let dbServiceSpy: {col$: ReturnType<typeof vi.fn>; doc$: ReturnType<typeof vi.fn>; doc: ReturnType<typeof vi.fn>};
  let routerSpy: {navigateByUrl: ReturnType<typeof vi.fn>};
  let authStateSubject: BehaviorSubject<unknown>;
  let createAuthStateSpy: ReturnType<typeof vi.fn>;
  let runInFirebaseContextSpy: ReturnType<typeof vi.fn>;

  beforeEach(async () => {
    authStateSubject = new BehaviorSubject<unknown>(null);
    dbServiceSpy = {col$: vi.fn(), doc$: vi.fn(), doc: vi.fn()};
    routerSpy = {navigateByUrl: vi.fn()};
    dbServiceSpy.col$.mockReturnValue(of([{id: 'user-1'}]) as never);
    dbServiceSpy.doc$.mockImplementation((path: string) => {
      if (path === 'users/user-1') {
        return of({id: 'user-1', name: 'Benjamin', role: 'leader', chordMode: 'letters', songUsage: {}}) as never;
      }
      if (path === 'users/user-2') {
        return of({id: 'user-2', name: 'Paula', role: 'user', chordMode: 'letters', songUsage: {}}) as never;
      }

      return of(null) as never;
    });
    dbServiceSpy.doc.mockReturnValue({
      update: vi.fn().mockResolvedValue(undefined),
      set: vi.fn().mockResolvedValue(undefined),
    } as never);
    routerSpy.navigateByUrl.mockResolvedValue(true);

    createAuthStateSpy = vi
      .spyOn(UserSessionService.prototype as unknown as {createAuthState$: () => unknown}, 'createAuthState$')
      .mockReturnValue(authStateSubject.asObservable() as never) as unknown as ReturnType<typeof vi.fn>;

    await TestBed.configureTestingModule({
      providers: [
        {provide: DbService, useValue: dbServiceSpy},
        {provide: Router, useValue: routerSpy},
        {provide: Auth, useValue: {}},
      ],
    });

    service = TestBed.inject(UserSessionService);
    runInFirebaseContextSpy = vi.spyOn(service as unknown as {runInFirebaseContext: (...args: unknown[]) => Promise<unknown>}, 'runInFirebaseContext') as unknown as ReturnType<
      typeof vi.fn
    >;
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
    expect(createAuthStateSpy).toHaveBeenCalled();
  });

  it('should derive userId$ and loggedIn$ from authState', async () => {
    authStateSubject.next({uid: 'user-1'});

    await expect(firstValueFrom(service.userId$)).resolves.toEqual('user-1');
    await expect(firstValueFrom(service.loggedIn$())).resolves.toEqual(true);
  });

  it('should resolve the current user document from auth state', async () => {
    authStateSubject.next({uid: 'user-1'});

    await expect(firstValueFrom(service.user$)).resolves.toEqual(expect.objectContaining({id: 'user-1', name: 'Benjamin'}) as never);
  });

  it('should cache user lookups by id', async () => {
    const first$ = service.getUserbyId$('user-2');
    const second$ = service.getUserbyId$('user-2');

    expect(first$).toBe(second$);
    await expect(firstValueFrom(first$)).resolves.toEqual(expect.objectContaining({id: 'user-2'}) as never);
  });

  it('should login and initialize songUsage when missing', async () => {
    dbServiceSpy.doc$.mockImplementation((path: string) => {
      if (path === 'users/user-1') {
        return of({id: 'user-1', name: 'Benjamin', role: 'leader', chordMode: 'letters'}) as never;
      }

      return of(null) as never;
    });
    const updateSpy = vi.fn().mockResolvedValue(undefined);
    dbServiceSpy.doc.mockReturnValue({update: updateSpy} as never);
    runInFirebaseContextSpy.mockResolvedValue({user: {uid: 'user-1'}});
    authStateSubject.next({uid: 'user-1'});

    await expect(service.login('mail', 'secret')).resolves.toEqual('user-1');

    expect(runInFirebaseContextSpy).toHaveBeenCalledTimes(1);
    expect(updateSpy).toHaveBeenCalledWith({songUsage: {}});
  });

  it('should wait for auth state propagation before resolving login', async () => {
    runInFirebaseContextSpy.mockResolvedValue({user: {uid: 'user-1'}});

    let resolved = false;
    const loginPromise = service.login('mail', 'secret').then(result => {
      resolved = true;
      return result;
    });

    await Promise.resolve();
    expect(resolved).toBe(false);

    authStateSubject.next({uid: 'user-1'});

    await expect(loginPromise).resolves.toEqual('user-1');
  });

  it('should delegate logout and password reset to AngularFire auth APIs', async () => {
    runInFirebaseContextSpy.mockResolvedValue(undefined);

    await service.logout();
    await service.changePassword('mail@example.com');

    expect(runInFirebaseContextSpy).toHaveBeenCalledTimes(2);
  });

  it('should create a new user document and navigate afterwards', async () => {
    dbServiceSpy.doc$.mockImplementation((path: string) => {
      if (path === 'users/user-3') {
        return of({id: 'user-3', name: 'New User', role: 'user', chordMode: 'onlyFirst', songUsage: {}}) as never;
      }

      return of(null) as never;
    });
    const setSpy = vi.fn().mockResolvedValue(undefined);
    dbServiceSpy.doc.mockReturnValue({set: setSpy} as never);
    runInFirebaseContextSpy.mockResolvedValue({user: {uid: 'user-3'}});

    await service.createNewUser('mail@example.com', 'New User', 'secret');

    expect(runInFirebaseContextSpy).toHaveBeenCalledTimes(1);
    expect(setSpy).toHaveBeenCalledWith({name: 'New User', chordMode: 'onlyFirst', songUsage: {}});
    expect(routerSpy.navigateByUrl).toHaveBeenCalledWith('/brand/new-user');
  });
});
