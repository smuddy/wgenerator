import {ComponentFixture, TestBed} from '@angular/core/testing';
import {BehaviorSubject, of} from 'rxjs';
import {ListItemComponent} from './list-item.component';
import {UserService} from '../../../../services/user/user.service';

describe('ListItemComponent', () => {
  let component: ListItemComponent;
  let fixture: ComponentFixture<ListItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListItemComponent],
      providers: [
        {
          provide: UserService,
          useValue: {
            user$: new BehaviorSubject<unknown>({id: 'user-1'}).asObservable(),
            userId$: new BehaviorSubject<string | null>('user-1').asObservable(),
            loggedIn$: () => of(true),
            getUserbyId$: () => of({name: 'Benjamin'}),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ListItemComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    void expect(component).toBeTruthy();
  });

  it('should render a status badge when provided', () => {
    component.show = {date: {toDate: () => new Date('2026-03-15')} as never, owner: 'user-1', showType: 'misc-private'} as never;
    component.showStatusBadge = 'nicht gemeldet';
    component.showStatusBadgeType = 'error';

    fixture.detectChanges();

    const badge = fixture.nativeElement.querySelector('app-badge .badge');
    expect(badge?.textContent?.trim()).toBe('nicht gemeldet');
    expect(badge?.className).toContain('error');
  });
});
