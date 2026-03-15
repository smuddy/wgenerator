import {TestBed} from '@angular/core/testing';
import {Storage} from '@angular/fire/storage';
import {FileDataService} from './file-data.service';
import {FileService} from './file.service';

describe('FileService', () => {
  let service: FileService;
  let fileDataServiceSpy: jasmine.SpyObj<FileDataService>;
  type FileServiceInternals = FileService & {
    resolveDownloadUrl: (path: string) => Promise<string>;
    deleteFromStorage: (path: string) => Promise<void>;
  };

  beforeEach(async () => {
    fileDataServiceSpy = jasmine.createSpyObj<FileDataService>('FileDataService', ['delete']);
    fileDataServiceSpy.delete.and.resolveTo();

    await TestBed.configureTestingModule({
      providers: [
        {provide: Storage, useValue: {app: 'test-storage'}},
        {provide: FileDataService, useValue: fileDataServiceSpy},
      ],
    });

    service = TestBed.inject(FileService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should resolve download urls via AngularFire storage helpers', async () => {
    const resolveSpy = spyOn<any>(service as FileServiceInternals, 'resolveDownloadUrl').and.resolveTo('https://cdn.example/file.pdf');

    await expectAsync(service.getDownloadUrl('songs/song-1/file.pdf').toPromise()).toBeResolvedTo('https://cdn.example/file.pdf');

    expect(resolveSpy).toHaveBeenCalledWith('songs/song-1/file.pdf');
  });

  it('should delete the file from storage and metadata from firestore', async () => {
    const deleteFromStorageSpy = spyOn<any>(service as FileServiceInternals, 'deleteFromStorage').and.resolveTo();

    await service.delete('songs/song-1/file.pdf', 'song-1', 'file-1');

    expect(deleteFromStorageSpy).toHaveBeenCalledWith('songs/song-1/file.pdf');
    expect(fileDataServiceSpy.delete).toHaveBeenCalledWith('song-1', 'file-1');
  });
});
