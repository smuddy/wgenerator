import {TestBed} from '@angular/core/testing';
import {Storage} from '@angular/fire/storage';
import {FileDataService} from './file-data.service';
import {FileService} from './file.service';

describe('FileService', () => {
  let service: FileService;
  let fileDataServiceSpy: jasmine.SpyObj<FileDataService>;

  beforeEach(() => {
    fileDataServiceSpy = jasmine.createSpyObj<FileDataService>('FileDataService', ['delete']);
    fileDataServiceSpy.delete.and.resolveTo();

    void TestBed.configureTestingModule({
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
    const resolveSpy = spyOn<any>(service, 'resolveDownloadUrl').and.resolveTo('https://cdn.example/file.pdf');

    await expectAsync(service.getDownloadUrl('songs/song-1/file.pdf').toPromise()).toBeResolvedTo('https://cdn.example/file.pdf');

    expect(resolveSpy).toHaveBeenCalledWith('songs/song-1/file.pdf');
  });

  it('should delete the file from storage and metadata from firestore', async () => {
    const deleteFromStorageSpy = spyOn<any>(service, 'deleteFromStorage').and.resolveTo();

    service.delete('songs/song-1/file.pdf', 'song-1', 'file-1');
    await Promise.resolve();

    expect(deleteFromStorageSpy).toHaveBeenCalledWith('songs/song-1/file.pdf');
    expect(fileDataServiceSpy.delete).toHaveBeenCalledWith('song-1', 'file-1');
  });
});
