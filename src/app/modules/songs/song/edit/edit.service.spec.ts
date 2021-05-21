import {TestBed} from '@angular/core/testing';

import {EditService} from './edit.service';

describe('EditService', () => {
  beforeEach(() => void TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: EditService = TestBed.inject(EditService);
    void expect(service).toBeTruthy();
  });
});
