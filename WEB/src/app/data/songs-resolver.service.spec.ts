import { TestBed } from '@angular/core/testing';

import { SongsResolverService } from './songs-resolver.service';

describe('SongsResolverService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SongsResolverService = TestBed.get(SongsResolverService);
    expect(service).toBeTruthy();
  });
});
