import {TestBed} from '@angular/core/testing';
import {BehaviorSubject, of} from 'rxjs';
import {vi} from 'vitest';
import {SongDataService} from '../../songs/services/song-data.service';
import {UserService} from '../../../services/user/user.service';
import {ShowService} from './show.service';
import {ShowSongDataService} from './show-song-data.service';
import {ShowSongService} from './show-song.service';
import {ShowSong} from './show-song';
import {Song} from '../../songs/services/song';
import {Show} from './show';
import {User} from '../../../services/user/user';

describe('ShowSongService', () => {
  let service: ShowSongService;
  let showSongDataServiceSpy: {
    add: ReturnType<typeof vi.fn>;
    read$: ReturnType<typeof vi.fn>;
    list$: ReturnType<typeof vi.fn>;
    delete: ReturnType<typeof vi.fn>;
    update$: ReturnType<typeof vi.fn>;
  };
  let songDataServiceSpy: {
    read$: ReturnType<typeof vi.fn>;
  };
  let userServiceSpy: {
    incSongCount: ReturnType<typeof vi.fn>;
    decSongCount: ReturnType<typeof vi.fn>;
    user$: ReturnType<BehaviorSubject<User | null>['asObservable']>;
  };
  let showServiceSpy: {
    read$: ReturnType<typeof vi.fn>;
    update$: ReturnType<typeof vi.fn>;
  };
  let user$: BehaviorSubject<User | null>;
  const song = {id: 'song-1', key: 'G', title: 'Amazing Grace'} as unknown as Song;
  const showSong = {id: 'show-song-1', songId: 'song-1'} as unknown as ShowSong;
  const show = {id: 'show-1', order: ['show-song-1', 'show-song-2']} as unknown as Show;

  beforeEach(async () => {
    user$ = new BehaviorSubject<User | null>({id: 'user-1', name: 'Benjamin', role: 'editor', chordMode: 'onlyFirst', songUsage: {}});
    showSongDataServiceSpy = {
      add: vi.fn(),
      read$: vi.fn(),
      list$: vi.fn(),
      delete: vi.fn(),
      update$: vi.fn(),
    };
    songDataServiceSpy = {
      read$: vi.fn(),
    };
    userServiceSpy = {
      incSongCount: vi.fn(),
      decSongCount: vi.fn(),
      user$: user$.asObservable(),
    };
    showServiceSpy = {
      read$: vi.fn(),
      update$: vi.fn(),
    };

    showSongDataServiceSpy.add.mockResolvedValue('show-song-2');
    showSongDataServiceSpy.read$.mockReturnValue(of(showSong));
    showSongDataServiceSpy.list$.mockReturnValue(of([showSong]));
    showSongDataServiceSpy.delete.mockResolvedValue(undefined);
    showSongDataServiceSpy.update$.mockResolvedValue(undefined);
    songDataServiceSpy.read$.mockReturnValue(of(song));
    userServiceSpy.incSongCount.mockResolvedValue(undefined);
    userServiceSpy.decSongCount.mockResolvedValue(undefined);
    showServiceSpy.read$.mockReturnValue(of(show));
    showServiceSpy.update$.mockResolvedValue(undefined);

    await TestBed.configureTestingModule({
      providers: [
        {provide: ShowSongDataService, useValue: showSongDataServiceSpy},
        {provide: SongDataService, useValue: songDataServiceSpy},
        {provide: UserService, useValue: userServiceSpy},
        {provide: ShowService, useValue: showServiceSpy},
      ],
    });

    service = TestBed.inject(ShowSongService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should create a show song from the song and current user', async () => {
    await expect(service.new$('show-1', 'song-1', true)).resolves.toBe('show-song-2');

    expect(userServiceSpy.incSongCount).toHaveBeenCalledWith('song-1');
    expect(showSongDataServiceSpy.add).toHaveBeenCalledWith('show-1', {
      ...song,
      songId: 'song-1',
      key: 'G',
      keyOriginal: 'G',
      chordMode: 'onlyFirst',
      addedLive: true,
    });
  });

  it('should return null when the song is missing', async () => {
    songDataServiceSpy.read$.mockReturnValue(of(null));

    await expect(service.new$('show-1', 'song-1')).resolves.toBe(null);

    expect(showSongDataServiceSpy.add).not.toHaveBeenCalled();
    expect(userServiceSpy.incSongCount).not.toHaveBeenCalled();
  });

  it('should return null when the current user is missing', async () => {
    user$.next(null);

    await expect(service.new$('show-1', 'song-1')).resolves.toBe(null);

    expect(showSongDataServiceSpy.add).not.toHaveBeenCalled();
    expect(userServiceSpy.incSongCount).not.toHaveBeenCalled();
  });

  it('should delegate reads to the data service', async () => {
    await expect(service.read('show-1', 'show-song-1')).resolves.toBe(showSong);
    expect(showSongDataServiceSpy.read$).toHaveBeenCalledWith('show-1', 'show-song-1');
  });

  it('should delegate list access to the data service', async () => {
    await expect(service.list('show-1')).resolves.toEqual([showSong]);
    expect(showSongDataServiceSpy.list$).toHaveBeenCalledWith('show-1');
  });

  it('should delete a show song, update the order and decrement song usage', async () => {
    await service.delete$('show-1', 'show-song-1', 0);

    expect(showSongDataServiceSpy.delete).toHaveBeenCalledWith('show-1', 'show-song-1');
    expect(showServiceSpy.update$).toHaveBeenCalledWith('show-1', expect.objectContaining({order: ['show-song-2']}));
    expect(userServiceSpy.decSongCount).toHaveBeenCalledWith('song-1');
  });

  it('should stop delete when the show is missing', async () => {
    showServiceSpy.read$.mockReturnValue(of(null));

    await service.delete$('show-1', 'show-song-1', 0);

    expect(showSongDataServiceSpy.delete).not.toHaveBeenCalled();
    expect(showServiceSpy.update$).not.toHaveBeenCalled();
    expect(userServiceSpy.decSongCount).not.toHaveBeenCalled();
  });

  it('should stop delete when the show song is missing', async () => {
    showSongDataServiceSpy.read$.mockReturnValue(of(null));

    await service.delete$('show-1', 'show-song-1', 0);

    expect(showSongDataServiceSpy.delete).not.toHaveBeenCalled();
    expect(showServiceSpy.update$).not.toHaveBeenCalled();
    expect(userServiceSpy.decSongCount).not.toHaveBeenCalled();
  });

  it('should delegate updates to the data service', async () => {
    await service.update$('show-1', 'show-song-1', {title: 'Updated'} as never);

    expect(showSongDataServiceSpy.update$).toHaveBeenCalledWith('show-1', 'show-song-1', {title: 'Updated'} as never);
  });
});
