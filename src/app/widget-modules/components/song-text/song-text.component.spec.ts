import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';

import {SongTextComponent} from './song-text.component';

describe('SongTextComponent', () => {
  let component: SongTextComponent;
  let fixture: ComponentFixture<SongTextComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [SongTextComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SongTextComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
