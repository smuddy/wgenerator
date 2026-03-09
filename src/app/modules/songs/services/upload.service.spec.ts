import {TestBed} from '@angular/core/testing';
import {Storage} from '@angular/fire/storage';

import {UploadService} from './upload.service';
import {FileDataService} from './file-data.service';

describe('UploadServiceService', () => {
  beforeEach(
    () =>
      void TestBed.configureTestingModule({
        providers: [
          {provide: Storage, useValue: {}},
          {provide: FileDataService, useValue: {set: () => Promise.resolve('')}},
        ],
      })
  );

  it('should be created', () => {
    const service: UploadService = TestBed.inject(UploadService);
    void expect(service).toBeTruthy();
  });
});
