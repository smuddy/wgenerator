import {TestBed} from '@angular/core/testing';
import {of} from 'rxjs';
import {DbService} from '../../../services/db.service';
import {FileDataService} from './file-data.service';

describe('FileDataService', () => {
  let service: FileDataService;
  let filesCollectionValueChangesSpy: ReturnType<typeof vi.fn<() => unknown>>;
  let filesCollectionAddSpy: ReturnType<typeof vi.fn<() => Promise<{id: string}>>>;
  let songDocCollectionSpy: ReturnType<typeof vi.fn<() => {add: typeof filesCollectionAddSpy; valueChanges: typeof filesCollectionValueChangesSpy}>>;
  let songDocSpy: ReturnType<typeof vi.fn<(path: string) => unknown>>;
  let fileDeleteSpy: ReturnType<typeof vi.fn<() => Promise<void>>>;
  let dbServiceSpy: {doc: typeof songDocSpy};

  beforeEach(async () => {
    filesCollectionValueChangesSpy = vi.fn().mockReturnValue(of([{id: 'file-1', name: 'plan.pdf'}]));
    filesCollectionAddSpy = vi.fn().mockResolvedValue({id: 'file-2'});
    songDocCollectionSpy = vi.fn().mockReturnValue({
      add: filesCollectionAddSpy,
      valueChanges: filesCollectionValueChangesSpy,
    });
    songDocSpy = vi.fn().mockImplementation((path: string) => {
      if (path.includes('/files/')) {
        return {delete: fileDeleteSpy};
      }

      return {collection: songDocCollectionSpy};
    });
    fileDeleteSpy = vi.fn().mockResolvedValue(undefined);
    dbServiceSpy = {doc: songDocSpy};

    await TestBed.configureTestingModule({
      providers: [{provide: DbService, useValue: dbServiceSpy}],
    });

    service = TestBed.inject(FileDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should add files to the song files subcollection and return the generated id', async () => {
    const file = {name: 'setlist.pdf', path: 'songs/song-1/files', createdAt: new Date()};

    await expect(service.set('song-1', file)).resolves.toEqual('file-2');

    expect(songDocSpy).toHaveBeenCalledWith('songs/song-1');
    expect(songDocCollectionSpy).toHaveBeenCalledWith('files');
    expect(filesCollectionAddSpy).toHaveBeenCalledWith(file);
  });

  it('should delete files from the nested file document path', async () => {
    await service.delete('song-4', 'file-9');

    expect(songDocSpy).toHaveBeenCalledWith('songs/song-4/files/file-9');
    expect(fileDeleteSpy).toHaveBeenCalled();
  });

  it('should read files from the files subcollection with the id field attached', () => {
    service.read$('song-3').subscribe();

    expect(songDocSpy).toHaveBeenCalledWith('songs/song-3');
    expect(songDocCollectionSpy).toHaveBeenCalledWith('files');
    expect(filesCollectionValueChangesSpy).toHaveBeenCalledWith({idField: 'id'});
  });
});
