import {TestBed} from '@angular/core/testing';
import {Router} from '@angular/router';
import {firstValueFrom, of} from 'rxjs';
import {UserService} from '../../services/user/user.service';
import {RoleGuard} from './role.guard';

describe('RoleGuard', () => {
  let guard: RoleGuard;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    routerSpy = jasmine.createSpyObj<Router>('Router', ['createUrlTree']);
    routerSpy.createUrlTree.and.callFake(commands => ({commands}) as never);

    await TestBed.configureTestingModule({
      providers: [
        {provide: Router, useValue: routerSpy},
        {provide: UserService, useValue: {user$: of(null)}},
      ],
    });

    guard = TestBed.inject(RoleGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  it('should throw when requiredRoles is missing', () => {
    expect(() => guard.canActivate({data: {}} as never)).toThrowError('requiredRoles is not defined!');
  });

  it('should deny access when there is no current user', async () => {
    await expectAsync(firstValueFrom(guard.canActivate({data: {requiredRoles: ['leader']}} as never))).toBeResolvedTo(
      {commands: ['brand', 'new-user']} as never
    );
  });

  it('should allow admins regardless of requiredRoles', async () => {
    TestBed.resetTestingModule();
    routerSpy = jasmine.createSpyObj<Router>('Router', ['createUrlTree']);
    TestBed.configureTestingModule({
      providers: [
        {provide: Router, useValue: routerSpy},
        {provide: UserService, useValue: {user$: of({role: 'user;admin'})}},
      ],
    });
    guard = TestBed.inject(RoleGuard);

    await expectAsync(firstValueFrom(guard.canActivate({data: {requiredRoles: ['leader']}} as never))).toBeResolvedTo(true);
  });

  it('should allow users with a matching required role', async () => {
    TestBed.resetTestingModule();
    routerSpy = jasmine.createSpyObj<Router>('Router', ['createUrlTree']);
    TestBed.configureTestingModule({
      providers: [
        {provide: Router, useValue: routerSpy},
        {provide: UserService, useValue: {user$: of({role: 'leader;user'})}},
      ],
    });
    guard = TestBed.inject(RoleGuard);

    await expectAsync(firstValueFrom(guard.canActivate({data: {requiredRoles: ['leader']}} as never))).toBeResolvedTo(true);
  });

  it('should redirect users without the required role to their role default route', async () => {
    TestBed.resetTestingModule();
    routerSpy = jasmine.createSpyObj<Router>('Router', ['createUrlTree']);
    routerSpy.createUrlTree.and.returnValue({redirect: ['presentation']} as never);
    TestBed.configureTestingModule({
      providers: [
        {provide: Router, useValue: routerSpy},
        {provide: UserService, useValue: {user$: of({role: 'presenter'})}},
      ],
    });
    guard = TestBed.inject(RoleGuard);

    const result = await firstValueFrom(guard.canActivate({data: {requiredRoles: ['leader']}} as never));
    expect(routerSpy.createUrlTree).toHaveBeenCalledWith(['presentation']);
    expect(result).toEqual({redirect: ['presentation']} as never);
  });

  it('should redirect members to shows instead of new-user', async () => {
    TestBed.resetTestingModule();
    routerSpy = jasmine.createSpyObj<Router>('Router', ['createUrlTree']);
    routerSpy.createUrlTree.and.returnValue({redirect: ['shows']} as never);
    TestBed.configureTestingModule({
      providers: [
        {provide: Router, useValue: routerSpy},
        {provide: UserService, useValue: {user$: of({role: 'member'})}},
      ],
    });
    guard = TestBed.inject(RoleGuard);

    const result = await firstValueFrom(guard.canActivate({data: {requiredRoles: ['user']}} as never));
    expect(routerSpy.createUrlTree).toHaveBeenCalledWith(['shows']);
    expect(result).toEqual({redirect: ['shows']} as never);
  });

  it('should choose a matching default route from all assigned roles', async () => {
    TestBed.resetTestingModule();
    routerSpy = jasmine.createSpyObj<Router>('Router', ['createUrlTree']);
    routerSpy.createUrlTree.and.callFake(commands => ({redirect: commands}) as never);
    TestBed.configureTestingModule({
      providers: [
        {provide: Router, useValue: routerSpy},
        {provide: UserService, useValue: {user$: of({role: ' none ; leader '})}},
      ],
    });
    guard = TestBed.inject(RoleGuard);

    const result = await firstValueFrom(guard.canActivate({data: {requiredRoles: ['presenter']}} as never));
    expect(routerSpy.createUrlTree).toHaveBeenCalledWith(['shows']);
    expect(result).toEqual({redirect: ['shows']} as never);
  });
});
