import {TestBed} from '@angular/core/testing';
import {of} from 'rxjs';
import {SongService} from './song.service';
import {SongListResolver} from './song-list.resolver';

describe('SongListResolver', () => {
  let resolver: SongListResolver;
  let songServiceSpy: jasmine.SpyObj<SongService>;

  beforeEach(async () => {
    songServiceSpy = jasmine.createSpyObj<SongService>('SongService', ['list$']);
    songServiceSpy.list$.and.returnValue(of([{id: 'song-1', title: 'Amazing Grace'}] as never));

    await TestBed.configureTestingModule({
      providers: [{provide: SongService, useValue: songServiceSpy}],
    });

    resolver = TestBed.inject(SongListResolver);
  });

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });

  it('should resolve the first emitted song list from the service', done => {
    resolver.resolve().subscribe(songs => {
      expect(songServiceSpy.list$).toHaveBeenCalled();
      expect(songs).toEqual([{id: 'song-1', title: 'Amazing Grace'}] as never);
      done();
    });
  });
});
