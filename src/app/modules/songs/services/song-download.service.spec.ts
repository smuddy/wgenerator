import {TestBed} from '@angular/core/testing';
import {of} from 'rxjs';
import {UserSessionService} from '../../../services/user/user-session.service';
import {User} from '../../../services/user/user';
import {SongDataService} from './song-data.service';
import {SongDownloadService} from './song-download.service';

describe('SongDownloadService', () => {
  let service: SongDownloadService;
  let songDataServiceSpy: {listLoaded$: ReturnType<typeof vi.fn>};
  let sessionSpy: {update$: ReturnType<typeof vi.fn>; user$: unknown};
  let createObjectUrlSpy: ReturnType<typeof vi.spyOn>;
  let revokeObjectUrlSpy: ReturnType<typeof vi.spyOn>;
  let clickSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(async () => {
    songDataServiceSpy = {
      listLoaded$: vi.fn(),
    };
    sessionSpy = {
      update$: vi.fn(),
      user$: of({id: 'admin-1', name: 'Admin', role: 'admin', chordMode: 'onlyFirst', songUsage: {}} as User),
    };
    songDataServiceSpy.listLoaded$.mockReturnValue(
      of([
        {id: 'song-2', number: 2, title: 'Zweiter Song'},
        {id: 'song-1', number: 1, title: 'Erster Song'},
      ] as never)
    );
    createObjectUrlSpy = vi.spyOn(window.URL, 'createObjectURL').mockReturnValue('blob:songs');
    revokeObjectUrlSpy = vi.spyOn(window.URL, 'revokeObjectURL').mockImplementation(() => undefined);
    clickSpy = vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => undefined);

    await TestBed.configureTestingModule({
      providers: [
        {provide: SongDataService, useValue: songDataServiceSpy},
        {provide: UserSessionService, useValue: sessionSpy},
      ],
    });

    service = TestBed.inject(SongDownloadService);
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it('should download all songs as sorted JSON', async () => {
    vi.useFakeTimers();

    const result = await service.downloadSongs();

    const [blob, fileName] = createObjectUrlSpy.mock.calls.at(-1) as unknown as [Blob, string];

    expect(blob.type).toBe('application/json');
    expect(fileName).toBeUndefined();
    expect(clickSpy).toHaveBeenCalled();
    expect(result?.songsDownloaded).toBe(2);
    expect(result?.fileName).toMatch(/^songs-\d{4}-\d{2}-\d{2}\.json$/);

    const text = await blob.text();
    expect(JSON.parse(text).map((song: {id: string}) => song.id)).toEqual(['song-1', 'song-2']);

    await vi.advanceTimersByTimeAsync(1000);
    expect(revokeObjectUrlSpy).toHaveBeenCalledWith('blob:songs');
  });

  it('should reject downloads for non-admin users', async () => {
    Object.defineProperty(sessionSpy, 'user$', {
      value: of({id: 'user-1', name: 'User', role: 'leader', chordMode: 'onlyFirst', songUsage: {}} as User),
    });

    await expect(service.downloadSongs()).rejects.toThrow('Admin role required to download songs.');
  });
});
