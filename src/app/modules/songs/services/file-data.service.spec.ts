import {TestBed} from '@angular/core/testing';

import {FileDataService} from './file-data.service';

describe('FileDataService', () => {
  beforeEach(() => void TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: FileDataService = TestBed.inject(FileDataService);
    void expect(service).toBeTruthy();
  });
});
