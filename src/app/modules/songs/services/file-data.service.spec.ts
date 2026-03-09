import {TestBed} from '@angular/core/testing';
import {of} from 'rxjs';
import {DbService} from '../../../services/db.service';
import {FileDataService} from './file-data.service';

describe('FileDataService', () => {
  let service: FileDataService;
  let filesCollectionValueChangesSpy: jasmine.Spy;
  let filesCollectionAddSpy: jasmine.Spy;
  let songDocCollectionSpy: jasmine.Spy;
  let songDocSpy: jasmine.Spy;
  let fileDeleteSpy: jasmine.Spy;
  let dbServiceSpy: jasmine.SpyObj<DbService>;

  beforeEach(() => {
    filesCollectionValueChangesSpy = jasmine.createSpy('valueChanges').and.returnValue(of([{id: 'file-1', name: 'plan.pdf'}]));
    filesCollectionAddSpy = jasmine.createSpy('add').and.resolveTo({id: 'file-2'});
    songDocCollectionSpy = jasmine.createSpy('collection').and.returnValue({
      add: filesCollectionAddSpy,
      valueChanges: filesCollectionValueChangesSpy,
    });
    songDocSpy = jasmine.createSpy('songDoc').and.callFake((path: string) => {
      if (path.includes('/files/')) {
        return {delete: fileDeleteSpy};
      }

      return {collection: songDocCollectionSpy};
    });
    fileDeleteSpy = jasmine.createSpy('delete').and.resolveTo();
    dbServiceSpy = jasmine.createSpyObj<DbService>('DbService', ['doc']);
    dbServiceSpy.doc.and.callFake(songDocSpy);

    void TestBed.configureTestingModule({
      providers: [{provide: DbService, useValue: dbServiceSpy}],
    });

    service = TestBed.inject(FileDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should add files to the song files subcollection and return the generated id', async () => {
    const file = {name: 'setlist.pdf', path: 'songs/song-1/files', createdAt: new Date()};

    await expectAsync(service.set('song-1', file)).toBeResolvedTo('file-2');

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
