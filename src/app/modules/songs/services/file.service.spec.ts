import {TestBed} from '@angular/core/testing';
import {Storage} from '@angular/fire/storage';

import {FileService} from './file.service';
import {FileDataService} from './file-data.service';

describe('FileService', () => {
  let service: FileService;

  beforeEach(() => {
    void TestBed.configureTestingModule({
      providers: [
        {provide: Storage, useValue: {}},
        {provide: FileDataService, useValue: {delete: () => Promise.resolve()}},
      ],
    });
    service = TestBed.inject(FileService);
  });

  it('should be created', () => {
    void expect(service).toBeTruthy();
  });
});
