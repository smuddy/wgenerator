import {TestBed} from '@angular/core/testing';
import {of} from 'rxjs';
import {beforeEach, describe, expect, it, vi} from 'vitest';
import {DbService} from '../db.service';
import {ShowDataService} from '../../modules/shows/services/show-data.service';
import {ShowSongDataService} from '../../modules/shows/services/show-song-data.service';
import {UserSessionService} from './user-session.service';
import {UserSongUsageService} from './user-song-usage.service';

describe('UserSongUsageService', () => {
  let service: UserSongUsageService;
  let dbServiceSpy: {doc: ReturnType<typeof vi.fn>};
  let sessionSpy: {update$: ReturnType<typeof vi.fn>; user$: unknown; users$: unknown};
  let showDataServiceSpy: {listRaw$: ReturnType<typeof vi.fn>};
  let showSongDataServiceSpy: {list$: ReturnType<typeof vi.fn>};

  beforeEach(async () => {
    dbServiceSpy = {doc: vi.fn()};
    sessionSpy = {
      update$: vi.fn(),
      user$: of({id: 'user-1', role: 'admin', songUsage: {}}) as never,
      users$: of([{id: 'user-1'}, {id: 'user-2'}]) as never,
    };
    showDataServiceSpy = {listRaw$: vi.fn()};
    showSongDataServiceSpy = {list$: vi.fn()};

    sessionSpy.update$.mockResolvedValue(undefined);
    showDataServiceSpy.listRaw$.mockReturnValue(
      of([
        {id: 'show-1', owner: 'user-1', archived: false},
        {id: 'show-2', owner: 'user-2', archived: true},
      ]) as never
    );
    showSongDataServiceSpy.list$.mockImplementation(
      (showId: string) => of(showId === 'show-1' ? [{songId: 'song-1'}, {songId: 'song-1'}, {songId: 'song-2'}] : [{songId: 'song-3'}]) as never
    );
    dbServiceSpy.doc.mockReturnValue({update: vi.fn().mockResolvedValue(undefined)} as never);

    await TestBed.configureTestingModule({
      providers: [
        {provide: DbService, useValue: dbServiceSpy},
        {provide: UserSessionService, useValue: sessionSpy},
        {provide: ShowDataService, useValue: showDataServiceSpy},
        {provide: ShowSongDataService, useValue: showSongDataServiceSpy},
      ],
    });

    service = TestBed.inject(UserSongUsageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should increment and decrement song usage for the current user', async () => {
    const updateSpy = vi.fn().mockResolvedValue(undefined);
    dbServiceSpy.doc.mockReturnValue({update: updateSpy} as never);

    await service.incSongCount('song-1');
    await service.decSongCount('song-2');

    expect(dbServiceSpy.doc).toHaveBeenCalledWith('users/user-1');
    expect(updateSpy.mock.calls[0]?.[0]).toEqual({'songUsage.song-1': expect.anything()});
    expect(updateSpy.mock.calls[1]?.[0]).toEqual({'songUsage.song-2': expect.anything()});
  });

  it('should rebuild song usage for all users based on owned show songs', async () => {
    await expect(service.rebuildSongUsage()).resolves.toEqual({
      usersProcessed: 2,
      showsProcessed: 2,
      showSongsProcessed: 3,
    });

    expect(sessionSpy.update$).toHaveBeenCalledWith('user-1', {songUsage: {'song-1': 2, 'song-2': 1}});
    expect(sessionSpy.update$).toHaveBeenCalledWith('user-2', {songUsage: {}});
  });

  it('should reject song usage rebuilds for non-admin users', async () => {
    Object.defineProperty(sessionSpy, 'user$', {value: of({id: 'user-1', role: 'leader'})});

    await expect(service.rebuildSongUsage()).rejects.toThrow('Admin role required to rebuild songUsage.');
  });
});
