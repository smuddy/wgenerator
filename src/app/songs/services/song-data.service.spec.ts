import {async, TestBed} from '@angular/core/testing';

import {SongDataService} from './song-data.service';
import {AngularFirestore} from '@angular/fire/firestore';
import {of} from 'rxjs';

describe('SongDataService', () => {

  const songs = [
    {title: 'title1'}
  ];

  const angularFirestoreCollection = {
    valueChanges: () => of(songs)
  };

  const mockAngularFirestore = {
    collection: path => angularFirestoreCollection
  };

  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      {provide: AngularFirestore, useValue: mockAngularFirestore}
    ]
  }));

  it('should be created', () => {
    const service: SongDataService = TestBed.get(SongDataService);
    expect(service).toBeTruthy();
  });

  it('should list songs', async(() => {
    const service: SongDataService = TestBed.get(SongDataService);
    service.list().subscribe(songs => {
        expect(songs).toEqual(<any>[
          {title: 'title1'}
        ]);
      }
    )
  }));
});
