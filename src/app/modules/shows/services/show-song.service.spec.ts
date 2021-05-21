import {TestBed} from '@angular/core/testing';

import {ShowSongService} from './show-song.service';

describe('ShowSongService', () => {
  let service: ShowSongService;

  beforeEach(() => {
    void TestBed.configureTestingModule({});
    service = TestBed.inject(ShowSongService);
  });

  it('should be created', () => {
    void expect(service).toBeTruthy();
  });
});
