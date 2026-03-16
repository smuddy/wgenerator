import {ComponentFixture, TestBed} from '@angular/core/testing';
import {SongListComponent} from './song-list.component';
import {of} from 'rxjs';
import {ActivatedRoute} from '@angular/router';
import {TextRenderingService} from '../services/text-rendering.service';
import {UserService} from '../../../services/user/user.service';
import {NO_ERRORS_SCHEMA} from '@angular/core';

describe('SongListComponent', () => {
  let component: SongListComponent;
  let fixture: ComponentFixture<SongListComponent>;

  const songs = [{id: 'song-1', title: 'title1', number: 1, text: '', flags: ''}];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SongListComponent],
      providers: [
        {provide: ActivatedRoute, useValue: {data: of({songs})}},
        {provide: TextRenderingService, useValue: {validateChordNotation: () => []}},
        {provide: UserService, useValue: {user$: of({role: 'leader'}), loggedIn$: () => of(true)}},
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SongListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    void expect(component).toBeTruthy();
  });
});
