import {TestBed} from '@angular/core/testing';
import {AdminService} from './admin.service';
import {SongDownloadService} from '../../modules/songs/services/song-download.service';
import {ShowSongIndexService} from '../../modules/shows/services/show-song-index.service';
import {UserSongUsageService} from '../user/user-song-usage.service';
import {beforeEach, describe, expect, it, vi} from 'vitest';

describe('AdminService', () => {
  let service: AdminService;
  let songDownloadSpy: {downloadSongs: ReturnType<typeof vi.fn>};
  let songUsageSpy: {rebuildSongUsage: ReturnType<typeof vi.fn>};
  let showSongIndexSpy: {rebuildShowSongIds: ReturnType<typeof vi.fn>};

  beforeEach(async () => {
    songDownloadSpy = {downloadSongs: vi.fn()};
    songUsageSpy = {rebuildSongUsage: vi.fn()};
    showSongIndexSpy = {rebuildShowSongIds: vi.fn()};

    songDownloadSpy.downloadSongs.mockResolvedValue({fileName: 'songs-2026-06-09.json', songsDownloaded: 4});
    songUsageSpy.rebuildSongUsage.mockResolvedValue({usersProcessed: 1, showsProcessed: 2, showSongsProcessed: 3});
    showSongIndexSpy.rebuildShowSongIds.mockResolvedValue({showsProcessed: 2, showSongsProcessed: 3});

    await TestBed.configureTestingModule({
      providers: [
        {provide: SongDownloadService, useValue: songDownloadSpy},
        {provide: UserSongUsageService, useValue: songUsageSpy},
        {provide: ShowSongIndexService, useValue: showSongIndexSpy},
      ],
    });

    service = TestBed.inject(AdminService);
  });

  it('should delegate admin operations to their domain services', async () => {
    const onProgress = vi.fn();

    await expect(service.downloadSongs()).resolves.toEqual({fileName: 'songs-2026-06-09.json', songsDownloaded: 4});
    await expect(service.rebuildSongUsage()).resolves.toEqual({usersProcessed: 1, showsProcessed: 2, showSongsProcessed: 3});
    await expect(service.rebuildShowSongIds(onProgress)).resolves.toEqual({showsProcessed: 2, showSongsProcessed: 3});

    expect(songDownloadSpy.downloadSongs).toHaveBeenCalled();
    expect(songUsageSpy.rebuildSongUsage).toHaveBeenCalled();
    expect(showSongIndexSpy.rebuildShowSongIds).toHaveBeenCalledWith(onProgress);
  });
});
