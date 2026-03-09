import {TestBed} from '@angular/core/testing';
import {Packer} from 'docx';
import {DocxService} from './docx.service';

describe('DocxService', () => {
  let service: DocxService;

  beforeEach(() => {
    void TestBed.configureTestingModule({});
    service = TestBed.inject(DocxService);
  });

  it('should be created', () => {
    void expect(service).toBeTruthy();
  });

  it('should not try to save a document when the required data cannot be prepared', async () => {
    const prepareDataSpy = spyOn<any>(service, 'prepareData').and.resolveTo(null);
    const saveAsSpy = spyOn<any>(service, 'saveAs');

    await service.create('show-1');

    expect(prepareDataSpy).toHaveBeenCalledWith('show-1');
    expect(saveAsSpy).not.toHaveBeenCalled();
  });

  it('should build and save a docx file when all data is available', async () => {
    const blob = new Blob(['docx']);
    const prepareDataSpy = spyOn<any>(service, 'prepareData').and.resolveTo({
      show: {
        showType: 'service-worship',
        date: {toDate: () => new Date('2026-03-10T00:00:00Z')},
      },
      songs: [],
      user: {name: 'Benjamin'},
      config: {ccliLicenseId: '12345'},
    });
    const prepareNewDocumentSpy = spyOn<any>(service, 'prepareNewDocument').and.returnValue({doc: true});
    const saveAsSpy = spyOn<any>(service, 'saveAs');
    spyOn(Packer, 'toBlob').and.resolveTo(blob);

    await service.create('show-1', {copyright: true});

    expect(prepareDataSpy).toHaveBeenCalledWith('show-1');
    expect(prepareNewDocumentSpy).toHaveBeenCalled();
    expect(Packer.toBlob).toHaveBeenCalledWith({doc: true} as never);
    expect(saveAsSpy).toHaveBeenCalledWith(blob, jasmine.stringMatching(/\.docx$/));
  });
});
