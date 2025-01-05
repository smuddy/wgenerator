import {TestBed} from '@angular/core/testing';

import {SongDataService} from './song-data.service';
import {AngularFirestore} from '@angular/fire/compat/firestore';
import {firstValueFrom, of} from 'rxjs';

describe('SongDataService', () => {
  const songs = [{title: 'title1'}];

  const angularFirestoreCollection = {
    valueChanges: () => of(songs),
  };

  const mockAngularFirestore = {
    collection: () => angularFirestoreCollection,
  };

  beforeEach(
    () =>
      void TestBed.configureTestingModule({
        providers: [{provide: AngularFirestore, useValue: mockAngularFirestore}],
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
