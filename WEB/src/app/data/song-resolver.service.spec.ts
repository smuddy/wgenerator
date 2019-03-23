import { TestBed } from '@angular/core/testing';

import { SongResolverService } from './song-resolver.service';

describe('SongResolverService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SongResolverService = TestBed.get(SongResolverService);
    expect(service).toBeTruthy();
  });
});
