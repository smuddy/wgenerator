import {TestBed} from '@angular/core/testing';

import {UploadService} from './upload.service';

describe('UploadServiceService', () => {
  beforeEach(() => void TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: UploadService = TestBed.inject(UploadService);
    void expect(service).toBeTruthy();
  });
});
