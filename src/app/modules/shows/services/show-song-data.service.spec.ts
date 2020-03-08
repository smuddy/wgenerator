import {TestBed} from '@angular/core/testing';

import {ShowSongDataService} from './show-song-data.service';

describe('ShowSongDataService', () => {
  let service: ShowSongDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ShowSongDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
