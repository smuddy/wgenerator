import {TestBed} from '@angular/core/testing';
import {firstValueFrom, of} from 'rxjs';
import {SongDataService} from './song-data.service';
import {SongService} from './song.service';
import {UserService} from '../../../services/user/user.service';
import {Timestamp} from '@angular/fire/firestore';

describe('SongService', () => {
  let service: SongService;
  let songDataServiceSpy: {
    read$: ReturnType<typeof vi.fn>;
    update$: ReturnType<typeof vi.fn>;
    add: ReturnType<typeof vi.fn>;
    delete: ReturnType<typeof vi.fn>;
    list$: unknown;
  };
  let userServiceSpy: {currentUser: ReturnType<typeof vi.fn>};
  const song = {
    id: 'song-1',
    title: 'Amazing Grace',
    edits: [],
  } as never;

  beforeEach(async () => {
    songDataServiceSpy = {
      read$: vi.fn(),
      update$: vi.fn(),
      add: vi.fn(),
      delete: vi.fn(),
      list$: of([song]),
    };
    userServiceSpy = {
      currentUser: vi.fn(),
    };

    songDataServiceSpy.read$.mockReturnValue(of(song));
    songDataServiceSpy.update$.mockResolvedValue(undefined);
    songDataServiceSpy.add.mockResolvedValue('song-2');
    songDataServiceSpy.delete.mockResolvedValue(undefined);
    userServiceSpy.currentUser.mockResolvedValue({name: 'Benjamin'} as never);

    await TestBed.configureTestingModule({
      providers: [
        {provide: SongDataService, useValue: songDataServiceSpy},
        {provide: UserService, useValue: userServiceSpy},
      ],
    });

    service = TestBed.inject(SongService);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should list songs from the data service', async () => {
    await expect(firstValueFrom(service.list$())).resolves.toEqual([song]);
  });

  it('should delegate reads to the data service', async () => {
    await expect(service.read('song-1')).resolves.toEqual(song);
    expect(songDataServiceSpy.read$).toHaveBeenCalledWith('song-1');
  });

  it('should append an edit with the current user when updating a song', async () => {
    const timestamp = {seconds: 1} as never;
    vi.spyOn(Timestamp, 'now').mockReturnValue(timestamp);

    await service.update$('song-1', {title: 'Updated'});

    expect(songDataServiceSpy.update$).toHaveBeenCalled();
    const [, payload] = songDataServiceSpy.update$.mock.calls.at(-1) as unknown as [string, Record<string, unknown>];
    expect(payload.title).toBe('Updated');
    expect(payload.edits).toEqual([{username: 'Benjamin', timestamp}]);
  });

  it('should not update when the song does not exist', async () => {
    songDataServiceSpy.read$.mockReturnValue(of(null));

    await service.update$('missing-song', {title: 'Updated'});

    expect(songDataServiceSpy.update$).not.toHaveBeenCalled();
  });

  it('should not update when no current user is available', async () => {
    userServiceSpy.currentUser.mockResolvedValue(null);

    await service.update$('song-1', {title: 'Updated'});

    expect(songDataServiceSpy.update$).not.toHaveBeenCalled();
  });

  it('should create new songs with the expected defaults', async () => {
    await expect(service.new(42, 'New Song')).resolves.toEqual('song-2');

    expect(songDataServiceSpy.add).toHaveBeenCalledWith({
      number: 42,
      title: 'New Song',
      status: 'draft',
      legalType: 'open',
    });
  });

  it('should delete songs via the data service', async () => {
    await service.delete('song-1');

    expect(songDataServiceSpy.delete).toHaveBeenCalledWith('song-1');
  });
});
