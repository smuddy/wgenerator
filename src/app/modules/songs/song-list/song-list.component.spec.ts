import {ComponentFixture, TestBed} from '@angular/core/testing';
import {SongListComponent} from './song-list.component';
import {firstValueFrom, of} from 'rxjs';
import {ActivatedRoute} from '@angular/router';
import {TextRenderingService} from '../services/text-rendering.service';
import {UserService} from '../../../services/user/user.service';
import {NO_ERRORS_SCHEMA} from '@angular/core';
import {FilterStoreService} from '../../../services/filter-store.service';
import {Song} from '../services/song';

describe('SongListComponent', () => {
  let component: SongListComponent;
  let fixture: ComponentFixture<SongListComponent>;
  let filterStore: FilterStoreService;

  const songs = [
    {id: 'song-1', title: 'title1', number: 1, text: '', flags: '', key: 'C'},
    {id: 'song-2', title: 'title2', number: 2, text: '', flags: '', key: 'D'},
  ] as Song[];

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
    filterStore = TestBed.inject(FilterStoreService);
    fixture.detectChanges();
  });

  it('should create', () => {
    void expect(component).toBeTruthy();
  });

  it('should expose unfiltered songs for filter option availability', async () => {
    filterStore.updateSongFilter({keyRoot: 'C'});

    const viewModel = await firstValueFrom(component.viewModel$);

    void expect(viewModel.songs.map(song => song.key)).toEqual(['C']);
    void expect(viewModel.availableSongs.map(song => song.key)).toEqual(['C', 'D']);
  });
});
