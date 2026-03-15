import {ComponentFixture, TestBed} from '@angular/core/testing';
import {Router} from '@angular/router';
import {of} from 'rxjs';
import {GlobalSettingsService} from '../../../services/global-settings.service';
import {ShowService} from '../../shows/services/show.service';
import {SelectComponent} from './select.component';

describe('SelectComponent', () => {
  let component: SelectComponent;
  let fixture: ComponentFixture<SelectComponent>;
  let showServiceSpy: jasmine.SpyObj<ShowService>;
  let globalSettingsServiceSpy: jasmine.SpyObj<GlobalSettingsService>;
  let routerSpy: jasmine.SpyObj<Router>;
  const createShow = (id: string, isoDate: string) => ({id, date: {toDate: () => new Date(isoDate)}});

  beforeEach(async () => {
    showServiceSpy = jasmine.createSpyObj<ShowService>('ShowService', ['list$', 'update$']);
    globalSettingsServiceSpy = jasmine.createSpyObj<GlobalSettingsService>('GlobalSettingsService', ['set']);
    routerSpy = jasmine.createSpyObj<Router>('Router', ['navigateByUrl']);

    showServiceSpy.list$.and.returnValue(
      of([
        createShow('older', '2025-12-15T00:00:00Z'),
        createShow('recent-a', '2026-03-01T00:00:00Z'),
        createShow('recent-b', '2026-02-20T00:00:00Z'),
      ]) as never
    );
    showServiceSpy.update$.and.resolveTo();
    globalSettingsServiceSpy.set.and.resolveTo();
    routerSpy.navigateByUrl.and.resolveTo(true);

    await TestBed.configureTestingModule({
      imports: [SelectComponent],
      providers: [
        {provide: ShowService, useValue: showServiceSpy},
        {provide: GlobalSettingsService, useValue: globalSettingsServiceSpy},
        {provide: Router, useValue: routerSpy},
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SelectComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should become visible on init', () => {
    component.ngOnInit();

    expect(component.visible).toBeTrue();
  });

  it('should expose recent shows sorted descending by date', done => {
    component.shows$.subscribe(shows => {
      expect(showServiceSpy.list$).toHaveBeenCalledWith(true);
      expect(shows.map(show => show.id)).toEqual(['recent-a', 'recent-b']);
      done();
    });
  });

  it('should persist the selected show, trigger presentation reset and navigate', async () => {
    const show = {id: 'show-1'} as never;
    component.visible = true;

    await component.selectShow(show);

    expect(component.visible).toBeFalse();
    expect(globalSettingsServiceSpy.set).toHaveBeenCalledWith({currentShow: 'show-1'});
    expect(showServiceSpy.update$).toHaveBeenCalledWith('show-1', {presentationSongId: 'title'});
    expect(routerSpy.navigateByUrl).toHaveBeenCalledWith('/presentation/remote');
  });
});
