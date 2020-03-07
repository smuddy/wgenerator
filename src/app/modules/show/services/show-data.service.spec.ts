import {TestBed} from '@angular/core/testing';

import {ShowDataService} from './show-data.service';

describe('ShowDataService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ShowDataService = TestBed.get(ShowDataService);
    expect(service).toBeTruthy();
  });
});
