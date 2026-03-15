import {TestBed} from '@angular/core/testing';
import {Router} from '@angular/router';
import {BehaviorSubject, firstValueFrom, of} from 'rxjs';
import {Auth} from '@angular/fire/auth';
import {DbService} from '../db.service';
import {UserSessionService} from './user-session.service';

describe('UserSessionService', () => {
  let service: UserSessionService;
  let dbServiceSpy: jasmine.SpyObj<DbService>;
  let routerSpy: jasmine.SpyObj<Router>;
  let authStateSubject: BehaviorSubject<unknown>;
  let createAuthStateSpy: jasmine.Spy;
  let runInFirebaseContextSpy: jasmine.Spy;

  beforeEach(async () => {
    authStateSubject = new BehaviorSubject<unknown>(null);
    dbServiceSpy = jasmine.createSpyObj<DbService>('DbService', ['col$', 'doc$', 'doc']);
    routerSpy = jasmine.createSpyObj<Router>('Router', ['navigateByUrl']);
    dbServiceSpy.col$.and.returnValue(of([{id: 'user-1'}]) as never);
    dbServiceSpy.doc$.and.callFake((path: string) => {
      if (path === 'users/user-1') {
        return of({id: 'user-1', name: 'Benjamin', role: 'leader', chordMode: 'letters', songUsage: {}}) as never;
      }
      if (path === 'users/user-2') {
        return of({id: 'user-2', name: 'Paula', role: 'user', chordMode: 'letters', songUsage: {}}) as never;
      }

      return of(null) as never;
    });
    dbServiceSpy.doc.and.returnValue({
      update: jasmine.createSpy('update').and.resolveTo(),
      set: jasmine.createSpy('set').and.resolveTo(),
    } as never);
    routerSpy.navigateByUrl.and.resolveTo(true);

    createAuthStateSpy = spyOn<any>(UserSessionService.prototype, 'createAuthState$').and.returnValue(authStateSubject.asObservable() as never);

    await TestBed.configureTestingModule({
      providers: [
        {provide: DbService, useValue: dbServiceSpy},
        {provide: Router, useValue: routerSpy},
        {provide: Auth, useValue: {}},
      ],
    });

    service = TestBed.inject(UserSessionService);
    runInFirebaseContextSpy = spyOn(service as UserSessionService & {runInFirebaseContext: (...args: unknown[]) => Promise<unknown>}, 'runInFirebaseContext');
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
    expect(createAuthStateSpy).toHaveBeenCalled();
  });

  it('should derive userId$ and loggedIn$ from authState', async () => {
    authStateSubject.next({uid: 'user-1'});

    await expectAsync(firstValueFrom(service.userId$)).toBeResolvedTo('user-1');
    await expectAsync(firstValueFrom(service.loggedIn$())).toBeResolvedTo(true);
  });

  it('should resolve the current user document from auth state', async () => {
    authStateSubject.next({uid: 'user-1'});

    await expectAsync(firstValueFrom(service.user$)).toBeResolvedTo(jasmine.objectContaining({id: 'user-1', name: 'Benjamin'}) as never);
  });

  it('should cache user lookups by id', async () => {
    const first$ = service.getUserbyId$('user-2');
    const second$ = service.getUserbyId$('user-2');

    expect(first$).toBe(second$);
    await expectAsync(firstValueFrom(first$)).toBeResolvedTo(jasmine.objectContaining({id: 'user-2'}) as never);
  });

  it('should login and initialize songUsage when missing', async () => {
    dbServiceSpy.doc$.and.callFake((path: string) => {
      if (path === 'users/user-1') {
        return of({id: 'user-1', name: 'Benjamin', role: 'leader', chordMode: 'letters'}) as never;
      }

      return of(null) as never;
    });
    const updateSpy = jasmine.createSpy('update').and.resolveTo();
    dbServiceSpy.doc.and.returnValue({update: updateSpy} as never);
    runInFirebaseContextSpy.and.resolveTo({user: {uid: 'user-1'}});

    await expectAsync(service.login('mail', 'secret')).toBeResolvedTo('user-1');

    expect(runInFirebaseContextSpy).toHaveBeenCalledTimes(1);
    expect(updateSpy).toHaveBeenCalledWith({songUsage: {}});
  });

  it('should delegate logout and password reset to AngularFire auth APIs', async () => {
    runInFirebaseContextSpy.and.resolveTo();

    await service.logout();
    await service.changePassword('mail@example.com');

    expect(runInFirebaseContextSpy).toHaveBeenCalledTimes(2);
  });

  it('should create a new user document and navigate afterwards', async () => {
    dbServiceSpy.doc$.and.callFake((path: string) => {
      if (path === 'users/user-3') {
        return of({id: 'user-3', name: 'New User', role: 'user', chordMode: 'onlyFirst', songUsage: {}}) as never;
      }

      return of(null) as never;
    });
    const setSpy = jasmine.createSpy('set').and.resolveTo();
    dbServiceSpy.doc.and.returnValue({set: setSpy} as never);
    runInFirebaseContextSpy.and.resolveTo({user: {uid: 'user-3'}});

    await service.createNewUser('mail@example.com', 'New User', 'secret');

    expect(runInFirebaseContextSpy).toHaveBeenCalledTimes(1);
    expect(setSpy).toHaveBeenCalledWith({name: 'New User', chordMode: 'onlyFirst', songUsage: {}});
    expect(routerSpy.navigateByUrl).toHaveBeenCalledWith('/brand/new-user');
  });
});
