import {TestBed} from '@angular/core/testing';

import {ShowSongService} from './show-song.service';

describe('ShowSongService', () => {
  let service: ShowSongService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ShowSongService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
