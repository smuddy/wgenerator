import {ComponentFixture, TestBed} from '@angular/core/testing';
import {BehaviorSubject, firstValueFrom, of} from 'rxjs';
import {skip, take} from 'rxjs/operators';
import {ListComponent} from './list.component';
import {ShowService} from '../services/show.service';
import {UserService} from '../../../services/user/user.service';
import {FilterStoreService} from '../../../services/filter-store.service';

describe('ListComponent', () => {
  let component: ListComponent;
  let fixture: ComponentFixture<ListComponent>;
  let shows$: BehaviorSubject<unknown[]>;
  let user$: BehaviorSubject<unknown>;
  const createShow = (overrides: Record<string, unknown>) => ({
    archived: false,
    date: {toDate: () => new Date('2026-03-01')},
    ...overrides,
  });

  beforeEach(async () => {
    shows$ = new BehaviorSubject<unknown[]>([]);
    user$ = new BehaviorSubject<unknown>({id: 'user-1'});

    await TestBed.configureTestingModule({
      imports: [ListComponent],
      providers: [
        {
          provide: ShowService,
          useValue: {
            list$: () => shows$.asObservable(),
            listPublicSince$: () => of([]),
          },
        },
        {
          provide: UserService,
          useValue: {
            user$: user$.asObservable(),
            loggedIn$: () => of(true),
            getUserbyId$: () => of({name: 'Benjamin'}),
          },
        },
        FilterStoreService,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ListComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    void expect(component).toBeTruthy();
  });

  it('should list own drafts and pending published shows in my shows', async () => {
    shows$.next([
      createShow({id: 'draft-own', owner: 'user-1', published: false, reportedType: null}),
      createShow({id: 'pending-own', owner: 'user-1', published: true, reportedType: 'pending', date: {toDate: () => new Date('2026-03-02')}}),
      createShow({id: 'reported-own', owner: 'user-1', published: true, reportedType: 'reported', date: {toDate: () => new Date('2026-03-03')}}),
      createShow({id: 'draft-other', owner: 'user-2', published: false, reportedType: null, date: {toDate: () => new Date('2026-03-04')}}),
    ] as never);

    const shows = await firstValueFrom(component.privateShows$);
    expect(shows.map(show => show.id)).toEqual(['pending-own', 'draft-own']);
  });

  it('should ignore show filters for my shows', async () => {
    const filterStore = TestBed.inject(FilterStoreService);
    filterStore.updateShowFilter({time: 0, showType: 'service-worship'});
    shows$.next([
      createShow({id: 'older-draft', owner: 'user-1', published: false, reportedType: null, showType: 'misc-private', date: {toDate: () => new Date('2025-01-01')}}),
      createShow({id: 'pending-own', owner: 'user-1', published: true, reportedType: 'pending', showType: 'home-group', date: {toDate: () => new Date('2026-03-05')}}),
    ] as never);

    const shows = await firstValueFrom(component.privateShows$);
    expect(shows.map(show => show.id)).toEqual(['pending-own', 'older-draft']);
  });

  it('should hide archived own shows until archived filter is enabled', async () => {
    const filterStore = TestBed.inject(FilterStoreService);
    shows$.next([
      createShow({id: 'draft-own', owner: 'user-1', published: false, reportedType: null, date: {toDate: () => new Date('2026-03-02')}}),
      createShow({id: 'archived-own', owner: 'user-1', published: true, archived: true, reportedType: 'reported', date: {toDate: () => new Date('2026-03-03')}}),
    ] as never);

    const initialShows = await firstValueFrom(component.privateShows$.pipe(take(1)));
    expect(initialShows.map(show => show.id)).toEqual(['draft-own']);

    const updatedShowsPromise = firstValueFrom(component.privateShows$.pipe(skip(1), take(1)));
    filterStore.updateShowFilter({archived: true});
    const updatedShows = await updatedShowsPromise;
    expect(updatedShows.map(show => show.id)).toEqual(['archived-own', 'draft-own']);
  });

  it('should sort public shows by date descending', async () => {
    const filterStore = TestBed.inject(FilterStoreService);
    filterStore.updateShowFilter({time: 99999});
    shows$.next([
      createShow({id: 'old-public', owner: 'user-2', published: true, archived: false, date: {toDate: () => new Date('2026-01-01')}}),
      createShow({id: 'new-public', owner: 'user-3', published: true, archived: false, date: {toDate: () => new Date('2026-03-10')}}),
      createShow({id: 'mid-public', owner: 'user-4', published: true, archived: false, date: {toDate: () => new Date('2026-02-05')}}),
    ] as never);

    const shows = await firstValueFrom(component.publicShows$.pipe(take(1)));
    expect(shows.map(show => show.id)).toEqual(['new-public', 'mid-public', 'old-public']);
  });
});
