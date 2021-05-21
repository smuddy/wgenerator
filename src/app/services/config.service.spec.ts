import {TestBed} from '@angular/core/testing';

import {ConfigService} from './config.service';

describe('ConfigService', () => {
  let service: ConfigService;

  beforeEach(() => {
    void TestBed.configureTestingModule({});
    service = TestBed.inject(ConfigService);
  });

  it('should be created', () => {
    void expect(service).toBeTruthy();
  });
});
