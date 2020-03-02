import {TestBed} from '@angular/core/testing';

import {FileDataService} from './file-data.service';

describe('FileDataService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: FileDataService = TestBed.get(FileDataService);
    expect(service).toBeTruthy();
  });
});
