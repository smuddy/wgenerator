import {TestBed} from '@angular/core/testing';
import {DocxService} from './docx.service';

describe('DocxService', () => {
  let service: DocxService;
  type PreparedData = {
    show: {
      showType: string;
      date: {toDate: () => Date};
    };
    songs: unknown[];
    user: {name: string};
    config: {ccliLicenseId: string};
  };
  type DocxModuleLike = {
    Packer: {toBlob: (document: unknown) => Promise<Blob>};
  };
  type DocxServiceInternals = DocxService & {
    prepareData: (showId: string) => Promise<PreparedData | null>;
    renderTitle: (docx: unknown, title: string) => unknown[];
    renderSongs: (docx: unknown, songs: unknown[], options: unknown, config: unknown) => unknown[];
    prepareNewDocument: (docx: unknown, data: unknown, options?: unknown, sections?: unknown) => unknown;
    saveAs: (blob: Blob, name: string) => void;
    loadDocx: () => Promise<DocxModuleLike>;
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({});
    service = TestBed.inject(DocxService);
  });

  it('should be created', () => {
    void expect(service).toBeTruthy();
  });

  it('should not try to save a document when the required data cannot be prepared', async () => {
    const serviceInternals = service as DocxServiceInternals;
    const prepareDataSpy = spyOn(serviceInternals, 'prepareData').and.resolveTo(null);
    const saveAsSpy = spyOn(serviceInternals, 'saveAs');

    await service.create('show-1');

    expect(prepareDataSpy).toHaveBeenCalledWith('show-1');
    expect(saveAsSpy).not.toHaveBeenCalled();
  });

  it('should build and save a docx file when all data is available', async () => {
    const blob = new Blob(['docx']);
    const docxModule: DocxModuleLike = {
      Packer: {
        toBlob: jasmine.createSpy('toBlob').and.resolveTo(blob),
      },
    };
    const serviceInternals = service as DocxServiceInternals;
    const prepareDataSpy = spyOn(serviceInternals, 'prepareData').and.resolveTo({
      show: {
        showType: 'service-worship',
        date: {toDate: () => new Date('2026-03-10T00:00:00Z')},
      },
      songs: [],
      user: {name: 'Benjamin'},
      config: {ccliLicenseId: '12345'},
    });
    spyOn(serviceInternals, 'loadDocx').and.resolveTo(docxModule);
    spyOn(serviceInternals, 'renderTitle').and.returnValue([]);
    spyOn(serviceInternals, 'renderSongs').and.returnValue([]);
    const prepareNewDocumentSpy = spyOn(serviceInternals, 'prepareNewDocument').and.returnValue({doc: true});
    const saveAsSpy = spyOn(serviceInternals, 'saveAs');

    await service.create('show-1', {copyright: true});

    expect(prepareDataSpy).toHaveBeenCalledWith('show-1');
    expect(prepareNewDocumentSpy).toHaveBeenCalled();
    expect(docxModule.Packer.toBlob).toHaveBeenCalledWith({doc: true} as never);
    expect(saveAsSpy).toHaveBeenCalledWith(blob, jasmine.stringMatching(/\.docx$/));
  });
});
