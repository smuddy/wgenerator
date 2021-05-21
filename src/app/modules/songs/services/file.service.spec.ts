import {TestBed} from '@angular/core/testing';

import {FileService} from './file.service';

describe('FileService', () => {
  let service: FileService;

  beforeEach(() => {
    void TestBed.configureTestingModule({});
    service = TestBed.inject(FileService);
  });

  it('should be created', () => {
    void expect(service).toBeTruthy();
  });
});
