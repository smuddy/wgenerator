import {TestBed} from '@angular/core/testing';
import {of} from 'rxjs';
import {vi} from 'vitest';
import {DbService} from '../../../services/db.service';
import {ShowSongDataService} from './show-song-data.service';

describe('ShowSongDataService', () => {
  let service: ShowSongDataService;
  let docUpdateSpy: ReturnType<typeof vi.fn>;
  let docDeleteSpy: ReturnType<typeof vi.fn>;
  let docSpy: ReturnType<typeof vi.fn>;
  let colAddSpy: ReturnType<typeof vi.fn>;
  let colSpy: ReturnType<typeof vi.fn>;
  let dbServiceSpy: {
    col$: ReturnType<typeof vi.fn>;
    doc$: ReturnType<typeof vi.fn>;
    doc: ReturnType<typeof vi.fn>;
    col: ReturnType<typeof vi.fn>;
  };

  beforeEach(async () => {
    docUpdateSpy = vi.fn().mockResolvedValue(undefined);
    docDeleteSpy = vi.fn().mockResolvedValue(undefined);
    docSpy = vi.fn().mockReturnValue({
      update: docUpdateSpy,
      delete: docDeleteSpy,
    });
    colAddSpy = vi.fn().mockResolvedValue({id: 'show-song-3'});
    colSpy = vi.fn().mockReturnValue({add: colAddSpy});
    dbServiceSpy = {
      col$: vi.fn().mockImplementation(() => of([{id: 'show-song-1'}]) as never),
      doc$: vi.fn().mockReturnValue(of({id: 'show-song-1'}) as never),
      doc: docSpy,
      col: colSpy,
    };

    await TestBed.configureTestingModule({
      providers: [{provide: DbService, useValue: dbServiceSpy}],
    });

    service = TestBed.inject(ShowSongDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should cache the list observable per show id when no query constraints are passed', () => {
    const first = service.list$('show-1');
    const second = service.list$('show-1');

    expect(first).toBe(second);
    expect(dbServiceSpy.col$).toHaveBeenCalledTimes(1);
    expect(dbServiceSpy.col$).toHaveBeenCalledWith('shows/show-1/songs');
  });

  it('should not reuse the cache when query constraints are passed', () => {
    const constraints = [{}] as never[];

    const first = service.list$('show-1', constraints as never);
    const second = service.list$('show-1', constraints as never);

    expect(first).not.toBe(second);
    expect(dbServiceSpy.col$).toHaveBeenCalledTimes(2);
    expect(dbServiceSpy.col$).toHaveBeenCalledWith('shows/show-1/songs', constraints as never);
  });

  it('should keep separate caches for different shows', () => {
    service.list$('show-1');
    service.list$('show-2');

    expect(dbServiceSpy.col$).toHaveBeenCalledTimes(2);
    expect(dbServiceSpy.col$).toHaveBeenCalledWith('shows/show-1/songs');
    expect(dbServiceSpy.col$).toHaveBeenCalledWith('shows/show-2/songs');
  });

  it('should read a single show song by nested document path', () => {
    service.read$('show-4', 'song-5').subscribe();

    expect(dbServiceSpy.doc$).toHaveBeenCalledWith('shows/show-4/songs/song-5');
  });

  it('should update a nested show song document', async () => {
    await service.update$('show-4', 'song-5', {title: 'Updated'} as never);

    expect(docSpy).toHaveBeenCalledWith('shows/show-4/songs/song-5');
    const [updatePayload] = docUpdateSpy.mock.lastCall as [Record<string, unknown>];
    expect(updatePayload).toEqual({title: 'Updated'});
  });

  it('should delete a nested show song document', async () => {
    await service.delete('show-4', 'song-5');

    expect(docSpy).toHaveBeenCalledWith('shows/show-4/songs/song-5');
    expect(docDeleteSpy).toHaveBeenCalled();
  });

  it('should add a song to the nested show songs collection and return the id', async () => {
    await expect(service.add('show-4', {songId: 'song-5'} as never)).resolves.toBe('show-song-3');

    expect(colSpy).toHaveBeenCalledWith('shows/show-4/songs');
    const [addPayload] = colAddSpy.mock.lastCall as [Record<string, unknown>];
    expect(addPayload).toEqual({songId: 'song-5'});
  });
});
