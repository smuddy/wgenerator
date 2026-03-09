import {TestBed} from '@angular/core/testing';
import {EditService} from './edit.service';

describe('EditService', () => {
  let service: EditService;

  beforeEach(() => {
    void TestBed.configureTestingModule({});
    service = TestBed.inject(EditService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should create a form with all editable song fields populated', () => {
    const form = service.createSongForm({
      text: 'Line 1',
      title: 'Amazing Grace',
      comment: 'Comment',
      flags: 'fast',
      key: 'G',
      tempo: 90,
      type: 'Praise',
      status: 'final',
      legalType: 'allowed',
      legalOwner: 'CCLI',
      legalOwnerId: '123',
      artist: 'Artist',
      label: 'Label',
      termsOfUse: 'Use it',
      origin: 'Origin',
    } as never);

    expect(form.getRawValue()).toEqual({
      text: 'Line 1',
      title: 'Amazing Grace',
      comment: 'Comment',
      flags: 'fast',
      key: 'G',
      tempo: 90,
      type: 'Praise',
      status: 'final',
      legalType: 'allowed',
      legalOwner: 'CCLI',
      legalOwnerId: '123',
      artist: 'Artist',
      label: 'Label',
      termsOfUse: 'Use it',
      origin: 'Origin',
    });
  });

  it('should default the status control to draft when the song has no status', () => {
    const form = service.createSongForm({
      text: '',
      title: 'Untitled',
      comment: '',
      flags: '',
      key: 'C',
      tempo: 80,
      type: 'Misc',
      legalType: 'open',
      legalOwner: 'other',
      legalOwnerId: '',
      artist: '',
      label: '',
      termsOfUse: '',
      origin: '',
    } as never);

    expect(form.get('status')?.value).toBe('draft');
  });
});
