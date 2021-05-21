import {TestBed} from '@angular/core/testing';

import {RoleGuard} from './role.guard';

describe('RoleGuard', () => {
  let guard: RoleGuard;

  beforeEach(() => {
    void TestBed.configureTestingModule({});
    guard = TestBed.inject(RoleGuard);
  });

  it('should be created', () => {
    void expect(guard).toBeTruthy();
  });
});
