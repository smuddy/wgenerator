import {TestBed} from '@angular/core/testing';

import {TextRenderingService} from './text-rendering.service';

describe('TextRenderingService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TextRenderingService = TestBed.get(TextRenderingService);
    expect(service).toBeTruthy();
  });
});
