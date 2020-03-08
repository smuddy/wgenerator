import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {SongComponent} from './song.component';
import {of} from 'rxjs';
import {ActivatedRoute} from '@angular/router';

describe('SongComponent', () => {
  let component: SongComponent;
  let fixture: ComponentFixture<SongComponent>;

  const mockActivatedRoute = {
    params: of({songId: '4711'})
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SongComponent],
      providers: [
        {provide: ActivatedRoute, useValue: mockActivatedRoute}
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SongComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

});
