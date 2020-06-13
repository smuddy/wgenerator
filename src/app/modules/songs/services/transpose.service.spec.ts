import {TestBed} from '@angular/core/testing';

import {TransposeService} from './transpose.service';

describe('TransposeService', () => {
  let service: TransposeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TransposeService);
  });

  it('should create map', () => {
    const distance = service.getDistance('D', 'G');
    const map = service.getMap('D', distance);

    console.log(map);
    expect(service).toBeTruthy();
  });
});
