import {TestBed} from '@angular/core/testing';
import {vi} from 'vitest';
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
  type DocxServiceInternals = {
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

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should be created', () => {
    void expect(service).toBeTruthy();
  });

  it('should not try to save a document when the required data cannot be prepared', async () => {
    const serviceInternals = service as unknown as DocxServiceInternals;
    const prepareDataSpy = vi.spyOn(serviceInternals, 'prepareData').mockResolvedValue(null);
    const saveAsSpy = vi.spyOn(serviceInternals, 'saveAs');

    await service.create('show-1');

    expect(prepareDataSpy).toHaveBeenCalledWith('show-1');
    expect(saveAsSpy).not.toHaveBeenCalled();
  });

  it('should build and save a docx file when all data is available', async () => {
    const blob = new Blob(['docx']);
    const docxModule: DocxModuleLike = {
      Packer: {
        toBlob: vi.fn().mockResolvedValue(blob),
      },
    };
    const serviceInternals = service as unknown as DocxServiceInternals;
    const prepareDataSpy = vi.spyOn(serviceInternals, 'prepareData').mockResolvedValue({
      show: {
        showType: 'service-worship',
        date: {toDate: () => new Date('2026-03-10T00:00:00Z')},
      },
      songs: [],
      user: {name: 'Benjamin'},
      config: {ccliLicenseId: '12345'},
    });
    vi.spyOn(serviceInternals, 'loadDocx').mockResolvedValue(docxModule);
    vi.spyOn(serviceInternals, 'renderTitle').mockReturnValue([]);
    vi.spyOn(serviceInternals, 'renderSongs').mockReturnValue([]);
    const prepareNewDocumentSpy = vi.spyOn(serviceInternals, 'prepareNewDocument').mockReturnValue({doc: true});
    const saveAsSpy = vi.spyOn(serviceInternals, 'saveAs');

    await service.create('show-1', {copyright: true});

    expect(prepareDataSpy).toHaveBeenCalledWith('show-1');
    expect(prepareNewDocumentSpy).toHaveBeenCalled();
    expect(docxModule.Packer.toBlob).toHaveBeenCalledWith({doc: true} as never);
    expect(saveAsSpy).toHaveBeenCalledWith(blob, expect.stringMatching(/\.docx$/));
  });
});
