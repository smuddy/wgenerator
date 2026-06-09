import {ComponentFixture, TestBed} from '@angular/core/testing';
import {ActivatedRoute} from '@angular/router';
import {BehaviorSubject, of} from 'rxjs';
import {beforeEach, describe, expect, it, vi} from 'vitest';
import {GuestComponent} from './guest.component';
import {GuestShowDataService} from './guest-show-data.service';

describe('GuestComponent', () => {
  let component: GuestComponent;
  let fixture: ComponentFixture<GuestComponent>;
  let guestShowDataServiceSpy: {read: ReturnType<typeof vi.fn>; read$: ReturnType<typeof vi.fn>};
  let guestShowSubject: BehaviorSubject<unknown>;

  beforeEach(async () => {
    guestShowSubject = new BehaviorSubject<unknown>({
      id: 'guest-1',
      showType: 'service-worship',
      date: {
        toDate: () => new Date('2026-03-20T00:00:00Z'),
      },
      songs: [
        {
          id: 'song-1',
          title: 'Titel',
          text: 'Text',
          artist: 'Artist',
        },
      ],
    });
    guestShowDataServiceSpy = {read: vi.fn(), read$: vi.fn()};
    guestShowDataServiceSpy.read.mockResolvedValue({
      id: 'guest-1',
      showType: 'service-worship',
      date: {
        toDate: () => new Date('2026-03-20T00:00:00Z'),
      },
      songs: [
        {
          id: 'song-1',
          title: 'Titel',
          text: 'Text',
          artist: 'Artist',
        },
      ],
    } as never);
    guestShowDataServiceSpy.read$.mockReturnValue(guestShowSubject.asObservable() as never);

    await TestBed.configureTestingModule({
      imports: [GuestComponent],
      providers: [
        {provide: ActivatedRoute, useValue: {params: of({id: 'guest-1'})}},
        {provide: GuestShowDataService, useValue: guestShowDataServiceSpy},
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(GuestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load and render the guest show', () => {
    expect(guestShowDataServiceSpy.read).toHaveBeenCalledWith('guest-1');
    expect(guestShowDataServiceSpy.read$).toHaveBeenCalledWith('guest-1');
    expect(fixture.nativeElement.textContent).toContain('Titel');
    expect(fixture.nativeElement.textContent).toContain('20.03.2026');
  });

  it('should update the rendered guest show when live data changes', async () => {
    guestShowSubject.next({
      id: 'guest-1',
      showType: 'service-worship',
      date: {
        toDate: () => new Date('2026-03-21T00:00:00Z'),
      },
      songs: [
        {
          id: 'song-2',
          title: 'Neuer Titel',
          text: 'Neuer Text',
          artist: 'Neue Artistin',
        },
      ],
    });

    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Neuer Titel');
    expect(fixture.nativeElement.textContent).toContain('21.03.2026');
  });
});
