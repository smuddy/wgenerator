import {async, TestBed} from '@angular/core/testing';

import {SongService} from './song.service';
import {SongDataService} from './song-data.service';
import {of} from 'rxjs';

describe('SongService', () => {

  const songs = [
    {title: 'title1'}
  ];

  const mockSongDataService = {
    list: () => of(songs)
  };

  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      {provide: SongDataService, useValue: mockSongDataService}
    ]
  }));

  it('should be created', () => {
    const service: SongService = TestBed.get(SongService);
    expect(service).toBeTruthy();
  });

  it('should list songs', async(() => {
    const service: SongService = TestBed.get(SongService);
    service.list$().subscribe(s => {
      expect(s).toEqual([
        {title: 'title1'}
      ] as any);
    });
  }));
});
