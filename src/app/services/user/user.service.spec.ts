import {TestBed} from '@angular/core/testing';

import {UserService} from './user.service';

describe('UserService', () => {
  beforeEach(() => void TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: UserService = TestBed.inject(UserService);
    void expect(service).toBeTruthy();
  });
});
