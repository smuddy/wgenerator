import {TestBed} from '@angular/core/testing';
import {Firestore} from '@angular/fire/firestore';

import {DbService} from './db.service';

describe('DbService', () => {
  beforeEach(
    () =>
      void TestBed.configureTestingModule({
        providers: [{provide: Firestore, useValue: {}}],
      })
  );

  it('should be created', () => {
    const service: DbService = TestBed.inject(DbService);
    void expect(service).toBeTruthy();
  });
});
