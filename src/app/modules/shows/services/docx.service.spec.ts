import {TestBed} from '@angular/core/testing';

import {DocxService} from './docx.service';

describe('DocxService', () => {
  let service: DocxService;

  beforeEach(() => {
    void TestBed.configureTestingModule({});
    service = TestBed.inject(DocxService);
  });

  it('should be created', () => {
    void expect(service).toBeTruthy();
  });
});
