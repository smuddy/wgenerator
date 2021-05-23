import {TestBed} from '@angular/core/testing';

import {TransposeService} from './transpose.service';

describe('TransposeService', () => {
  let service: TransposeService;

  beforeEach(() => {
    void TestBed.configureTestingModule({});
    service = TestBed.inject(TransposeService);
  });

  it('should create map upwards', () => {
    const distance = service.getDistance('D', 'G');
    const map = service.getMap('D', distance);

    if (map) {
      void expect(map['D']).toBe('G');
    }
  });

  it('should create map downwards', () => {
    const distance = service.getDistance('G', 'D');
    const map = service.getMap('G', distance);

    if (map) {
      void expect(map['G']).toBe('D');
    }
  });
});
