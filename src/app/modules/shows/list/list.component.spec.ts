import {ComponentFixture, TestBed} from '@angular/core/testing';
import {BehaviorSubject, of} from 'rxjs';
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

  it('should list own drafts and pending published shows in my shows', done => {
    shows$.next([
      createShow({id: 'draft-own', owner: 'user-1', published: false, reportedType: null}),
      createShow({id: 'pending-own', owner: 'user-1', published: true, reportedType: 'pending', date: {toDate: () => new Date('2026-03-02')}}),
      createShow({id: 'reported-own', owner: 'user-1', published: true, reportedType: 'reported', date: {toDate: () => new Date('2026-03-03')}}),
      createShow({id: 'draft-other', owner: 'user-2', published: false, reportedType: null, date: {toDate: () => new Date('2026-03-04')}}),
    ] as never);

    component.privateShows$.subscribe(shows => {
      expect(shows.map(show => show.id)).toEqual(['draft-own', 'pending-own']);
      done();
    });
  });

  it('should ignore show filters for my shows', done => {
    const filterStore = TestBed.inject(FilterStoreService);
    filterStore.updateShowFilter({time: 0, showType: 'service-worship'});
    shows$.next([
      createShow({id: 'older-draft', owner: 'user-1', published: false, reportedType: null, showType: 'misc-private', date: {toDate: () => new Date('2025-01-01')}}),
      createShow({id: 'pending-own', owner: 'user-1', published: true, reportedType: 'pending', showType: 'home-group', date: {toDate: () => new Date('2026-03-05')}}),
    ] as never);

    component.privateShows$.subscribe(shows => {
      expect(shows.map(show => show.id)).toEqual(['older-draft', 'pending-own']);
      done();
    });
  });
});
