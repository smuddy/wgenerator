import {TestBed} from '@angular/core/testing';

import {SongDataService} from './song-data.service';
import {firstValueFrom, of} from 'rxjs';
import {DbService} from '../../../services/db.service';

describe('SongDataService', () => {
  const songs = [{title: 'title1'}];

  const mockDbService = {
    col$: () => of(songs),
  };

  beforeEach(
    () =>
      void TestBed.configureTestingModule({
        providers: [{provide: DbService, useValue: mockDbService}],
      })
  );

  it('should be created', () => {
    const service: SongDataService = TestBed.inject(SongDataService);
    void expect(service).toBeTruthy();
  });

  it('should list songs', async () => {
    const service: SongDataService = TestBed.inject(SongDataService);
    const list = await firstValueFrom(service.list$);
    void expect(list[0].title).toEqual('title1');
  });
});
