import {TestBed} from '@angular/core/testing';

import {ScrollService} from './scroll.service';

describe('ScrollService', () => {
  let service: ScrollService;

  beforeEach(() => {
    void TestBed.configureTestingModule({});
    service = TestBed.inject(ScrollService);
  });

  it('should be created', () => {
    void expect(service).toBeTruthy();
  });
});
