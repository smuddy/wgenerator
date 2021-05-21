import {TestBed} from '@angular/core/testing';

import {GlobalSettingsService} from './global-settings.service';

describe('GlobalSettingsService', () => {
  let service: GlobalSettingsService;

  beforeEach(() => {
    void TestBed.configureTestingModule({});
    service = TestBed.inject(GlobalSettingsService);
  });

  it('should be created', () => {
    void expect(service).toBeTruthy();
  });
});
