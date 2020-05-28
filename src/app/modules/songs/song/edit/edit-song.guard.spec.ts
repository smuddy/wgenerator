import {TestBed} from '@angular/core/testing';

import {EditSongGuard} from './edit-song.guard';

describe('EditSongGuard', () => {
  let guard: EditSongGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(EditSongGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
