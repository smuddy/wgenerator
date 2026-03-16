import {TestBed} from '@angular/core/testing';
import {firstValueFrom, of} from 'rxjs';
import {SongService} from './song.service';
import {SongListResolver} from './song-list.resolver';

describe('SongListResolver', () => {
  let resolver: SongListResolver;
  let songServiceSpy: jasmine.SpyObj<SongService>;

  beforeEach(async () => {
    songServiceSpy = jasmine.createSpyObj<SongService>('SongService', ['listLoaded$']);
    songServiceSpy.listLoaded$.and.returnValue(of([{id: 'song-1', title: 'Amazing Grace'}]) as never);

    await TestBed.configureTestingModule({
      providers: [{provide: SongService, useValue: songServiceSpy}],
    });

    resolver = TestBed.inject(SongListResolver);
  });

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });

  it('should resolve the first emitted song list from the service', async () => {
    await expectAsync(firstValueFrom(resolver.resolve())).toBeResolvedTo([{id: 'song-1', title: 'Amazing Grace'}] as never);
    expect(songServiceSpy.listLoaded$).toHaveBeenCalled();
  });
});
