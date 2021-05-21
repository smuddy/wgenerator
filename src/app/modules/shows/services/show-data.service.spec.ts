import {TestBed} from '@angular/core/testing';

import {ShowDataService} from './show-data.service';

describe('ShowDataService', () => {
  beforeEach(() => void TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ShowDataService = TestBed.inject(ShowDataService);
    void expect(service).toBeTruthy();
  });
});
