import {TestBed} from '@angular/core/testing';
import {firstValueFrom, of} from 'rxjs';
import {SongService} from './song.service';
import {SongListResolver} from './song-list.resolver';

describe('SongListResolver', () => {
  let resolver: SongListResolver;
  let songServiceSpy: {listLoaded$: ReturnType<typeof vi.fn>};

  beforeEach(async () => {
    songServiceSpy = {
      listLoaded$: vi.fn().mockReturnValue(of([{id: 'song-1', title: 'Amazing Grace'}]) as never),
    };

    await TestBed.configureTestingModule({
      providers: [{provide: SongService, useValue: songServiceSpy}],
    });

    resolver = TestBed.inject(SongListResolver);
  });

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });

  it('should resolve the first emitted song list from the service', async () => {
    await expect(firstValueFrom(resolver.resolve())).resolves.toEqual([{id: 'song-1', title: 'Amazing Grace'}] as never);
    expect(songServiceSpy.listLoaded$).toHaveBeenCalled();
  });
});
