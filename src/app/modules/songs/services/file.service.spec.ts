import {TestBed} from '@angular/core/testing';
import {Storage} from '@angular/fire/storage';
import {FileDataService} from './file-data.service';
import {FileService} from './file.service';

describe('FileService', () => {
  let service: FileService;
  let fileDataServiceSpy: {delete: ReturnType<typeof vi.fn>};

  beforeEach(async () => {
    fileDataServiceSpy = {
      delete: vi.fn().mockResolvedValue(undefined),
    };

    await TestBed.configureTestingModule({
      providers: [
        FileService,
        {provide: Storage, useValue: {app: 'test-storage'}},
        {provide: FileDataService, useValue: fileDataServiceSpy},
      ],
    });

    service = TestBed.inject(FileService);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should resolve download urls via AngularFire storage helpers', async () => {
    const resolveSpy = vi.fn<(path: string) => Promise<string>>().mockResolvedValue('https://cdn.example/file.pdf');
    Object.assign(service, {resolveDownloadUrl: resolveSpy});

    await expect(service.getDownloadUrl('songs/song-1/file.pdf').toPromise()).resolves.toEqual('https://cdn.example/file.pdf');

    expect(resolveSpy).toHaveBeenCalledWith('songs/song-1/file.pdf');
  });

  it('should delete the file from storage and metadata from firestore', async () => {
    const deleteFromStorageSpy = vi.fn<(path: string) => Promise<void>>().mockResolvedValue(undefined);
    Object.assign(service, {deleteFromStorage: deleteFromStorageSpy});

    await service.delete('songs/song-1/file.pdf', 'song-1', 'file-1');

    expect(deleteFromStorageSpy).toHaveBeenCalledWith('songs/song-1/file.pdf');
    expect(fileDataServiceSpy.delete).toHaveBeenCalledWith('song-1', 'file-1');
  });
});
