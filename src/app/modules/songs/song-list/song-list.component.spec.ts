import {ComponentFixture, fakeAsync, TestBed, tick, waitForAsync} from '@angular/core/testing';

import {SongListComponent} from './song-list.component';
import {of} from 'rxjs';
import {SongService} from '../services/song.service';
import {NO_ERRORS_SCHEMA} from '@angular/core';

describe('SongListComponent', () => {
  let component: SongListComponent;
  let fixture: ComponentFixture<SongListComponent>;

  const songs = [
    {title: 'title1'}
  ];

  const mockSongService = {
    list: () => of(songs)
  };

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [SongListComponent],
      providers: [
        {provide: SongService, useValue: mockSongService}
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SongListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should read songs from SongService', fakeAsync(() => {
    tick();
    expect(component.songs$).toEqual([
      {title: 'title1'}
    ] as any);
  }));
});
