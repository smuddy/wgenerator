import {TestBed, waitForAsync} from '@angular/core/testing';

import {SongService} from './song.service';
import {SongDataService} from './song-data.service';
import {of} from 'rxjs';

describe('SongService', () => {
  const songs = [{title: 'title1'}];

  const mockSongDataService = {
    list: () => of(songs),
  };

  beforeEach(
    () =>
      void TestBed.configureTestingModule({
        providers: [{provide: SongDataService, useValue: mockSongDataService}],
      })
  );

  it('should be created', () => {
    const service: SongService = TestBed.inject(SongService);
    void expect(service).toBeTruthy();
  });

  it(
    'should list songs',
    waitForAsync(() => {
      const service: SongService = TestBed.inject(SongService);
      service.list$().subscribe(s => {
        void expect(s[0].title).toEqual('title1');
      });
    })
  );
});
