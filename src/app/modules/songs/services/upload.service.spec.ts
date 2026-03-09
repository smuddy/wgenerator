import {TestBed} from '@angular/core/testing';
import {Storage} from '@angular/fire/storage';
import {FileDataService} from './file-data.service';
import {Upload} from './upload';
import {UploadService} from './upload.service';

describe('UploadService', () => {
  let service: UploadService;
  let fileDataServiceSpy: jasmine.SpyObj<FileDataService>;

  beforeEach(() => {
    fileDataServiceSpy = jasmine.createSpyObj<FileDataService>('FileDataService', ['set']);
    fileDataServiceSpy.set.and.resolveTo('file-1');

    void TestBed.configureTestingModule({
      providers: [
        {provide: Storage, useValue: {app: 'test-storage'}},
        {provide: FileDataService, useValue: fileDataServiceSpy},
      ],
    });

    service = TestBed.inject(UploadService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should upload the file, update progress and persist file metadata on success', async () => {
    const task = {
      on: (event: string, progress: (snapshot: {bytesTransferred: number; totalBytes: number}) => void, error: () => void, success: () => void) => {
        progress({bytesTransferred: 50, totalBytes: 100});
        success();
      },
    };
    const uploadSpy = spyOn<any>(service, 'startUpload').and.returnValue(task as never);
    const upload = new Upload(new File(['content'], 'test.pdf', {type: 'application/pdf'}));

    service.pushUpload('song-1', upload);
    await Promise.resolve();

    expect(uploadSpy).toHaveBeenCalledWith('/attachments/song-1/test.pdf', upload.file);
    expect(upload.progress).toBe(50);
    expect(upload.path).toBe('/attachments/song-1');
    expect(fileDataServiceSpy.set).toHaveBeenCalledWith(
      'song-1',
      jasmine.objectContaining({
        name: 'test.pdf',
        path: '/attachments/song-1',
        createdAt: jasmine.any(Date),
      })
    );
  });
});
