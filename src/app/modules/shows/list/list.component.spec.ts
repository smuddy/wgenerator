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
      {id: 'draft-own', owner: 'user-1', published: false, reportedType: null},
      {id: 'pending-own', owner: 'user-1', published: true, reportedType: 'pending'},
      {id: 'reported-own', owner: 'user-1', published: true, reportedType: 'reported'},
      {id: 'draft-other', owner: 'user-2', published: false, reportedType: null},
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
      {id: 'older-draft', owner: 'user-1', published: false, reportedType: null, showType: 'misc-private'},
      {id: 'pending-own', owner: 'user-1', published: true, reportedType: 'pending', showType: 'home-group'},
    ] as never);

    component.privateShows$.subscribe(shows => {
      expect(shows.map(show => show.id)).toEqual(['older-draft', 'pending-own']);
      done();
    });
  });
});
