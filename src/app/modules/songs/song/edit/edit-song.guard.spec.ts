import {TestBed} from '@angular/core/testing';

import {EditSongGuard} from './edit-song.guard';

describe('EditSongGuard', () => {
  let guard: EditSongGuard;

  beforeEach(() => {
    void TestBed.configureTestingModule({});
    guard = TestBed.inject(EditSongGuard);
  });

  it('should be created', () => {
    void expect(guard).toBeTruthy();
  });
});
