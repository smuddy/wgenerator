import {TestBed} from '@angular/core/testing';
import {Router} from '@angular/router';
import {firstValueFrom, of} from 'rxjs';
import {vi} from 'vitest';
import {UserService} from '../../services/user/user.service';
import {RoleGuard} from './role.guard';

describe('RoleGuard', () => {
  let guard: RoleGuard;
  let createUrlTreeSpy: ReturnType<typeof vi.fn>;
  let routerSpy: Pick<Router, 'createUrlTree'>;

  beforeEach(async () => {
    createUrlTreeSpy = vi.fn().mockImplementation(commands => ({commands}) as never);
    routerSpy = {createUrlTree: createUrlTreeSpy as Router['createUrlTree']};

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
    await expect(firstValueFrom(guard.canActivate({data: {requiredRoles: ['leader']}} as never))).resolves.toEqual({commands: ['brand', 'new-user']} as never);
  });

  it('should allow admins regardless of requiredRoles', async () => {
    TestBed.resetTestingModule();
    createUrlTreeSpy = vi.fn();
    routerSpy = {createUrlTree: createUrlTreeSpy as Router['createUrlTree']};
    TestBed.configureTestingModule({
      providers: [
        {provide: Router, useValue: routerSpy},
        {provide: UserService, useValue: {user$: of({role: 'user;admin'})}},
      ],
    });
    guard = TestBed.inject(RoleGuard);

    await expect(firstValueFrom(guard.canActivate({data: {requiredRoles: ['leader']}} as never))).resolves.toEqual(true);
  });

  it('should allow users with a matching required role', async () => {
    TestBed.resetTestingModule();
    createUrlTreeSpy = vi.fn();
    routerSpy = {createUrlTree: createUrlTreeSpy as Router['createUrlTree']};
    TestBed.configureTestingModule({
      providers: [
        {provide: Router, useValue: routerSpy},
        {provide: UserService, useValue: {user$: of({role: 'leader;user'})}},
      ],
    });
    guard = TestBed.inject(RoleGuard);

    await expect(firstValueFrom(guard.canActivate({data: {requiredRoles: ['leader']}} as never))).resolves.toEqual(true);
  });

  it('should redirect users without the required role to their role default route', async () => {
    TestBed.resetTestingModule();
    createUrlTreeSpy = vi.fn().mockReturnValue({redirect: ['presentation']} as never);
    routerSpy = {createUrlTree: createUrlTreeSpy as Router['createUrlTree']};
    TestBed.configureTestingModule({
      providers: [
        {provide: Router, useValue: routerSpy},
        {provide: UserService, useValue: {user$: of({role: 'presenter'})}},
      ],
    });
    guard = TestBed.inject(RoleGuard);

    const result = await firstValueFrom(guard.canActivate({data: {requiredRoles: ['leader']}} as never));
    expect(createUrlTreeSpy).toHaveBeenCalledWith(['presentation']);
    expect(result).toEqual({redirect: ['presentation']} as never);
  });

  it('should redirect members to shows instead of new-user', async () => {
    TestBed.resetTestingModule();
    createUrlTreeSpy = vi.fn().mockReturnValue({redirect: ['shows']} as never);
    routerSpy = {createUrlTree: createUrlTreeSpy as Router['createUrlTree']};
    TestBed.configureTestingModule({
      providers: [
        {provide: Router, useValue: routerSpy},
        {provide: UserService, useValue: {user$: of({role: 'member'})}},
      ],
    });
    guard = TestBed.inject(RoleGuard);

    const result = await firstValueFrom(guard.canActivate({data: {requiredRoles: ['user']}} as never));
    expect(createUrlTreeSpy).toHaveBeenCalledWith(['shows']);
    expect(result).toEqual({redirect: ['shows']} as never);
  });

  it('should choose a matching default route from all assigned roles', async () => {
    TestBed.resetTestingModule();
    createUrlTreeSpy = vi.fn().mockImplementation(commands => ({redirect: commands}) as never);
    routerSpy = {createUrlTree: createUrlTreeSpy as Router['createUrlTree']};
    TestBed.configureTestingModule({
      providers: [
        {provide: Router, useValue: routerSpy},
        {provide: UserService, useValue: {user$: of({role: ' none ; leader '})}},
      ],
    });
    guard = TestBed.inject(RoleGuard);

    const result = await firstValueFrom(guard.canActivate({data: {requiredRoles: ['presenter']}} as never));
    expect(createUrlTreeSpy).toHaveBeenCalledWith(['shows']);
    expect(result).toEqual({redirect: ['shows']} as never);
  });
});
