import {TestBed} from '@angular/core/testing';

import {DbService} from './db.service';

describe('DbService', () => {
  beforeEach(() => void TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DbService = TestBed.inject(DbService);
    void expect(service).toBeTruthy();
  });
});
