import {ComponentFixture, TestBed} from '@angular/core/testing';
import {Router} from '@angular/router';
import {firstValueFrom, of} from 'rxjs';
import {vi} from 'vitest';
import {GlobalSettingsService} from '../../../services/global-settings.service';
import {ShowService} from '../../shows/services/show.service';
import {SelectComponent} from './select.component';

describe('SelectComponent', () => {
  let component: SelectComponent;
  let fixture: ComponentFixture<SelectComponent>;
  let showServiceSpy: {
    list$: ReturnType<typeof vi.fn>;
    update$: ReturnType<typeof vi.fn>;
  };
  let globalSettingsServiceSpy: {
    set: ReturnType<typeof vi.fn>;
  };
  let routerSpy: {
    navigateByUrl: ReturnType<typeof vi.fn>;
  };
  const createShow = (id: string, daysAgo: number) => {
    const date = new Date();
    date.setDate(date.getDate() - daysAgo);

    return {id, date: {toDate: () => date}};
  };

  beforeEach(async () => {
    showServiceSpy = {
      list$: vi.fn().mockReturnValue(
        of([
          createShow('older', 45),
          createShow('recent-a', 7),
          createShow('recent-b', 14),
        ]) as never
      ),
      update$: vi.fn().mockResolvedValue(undefined),
    };
    globalSettingsServiceSpy = {
      set: vi.fn().mockResolvedValue(undefined),
    };
    routerSpy = {
      navigateByUrl: vi.fn().mockResolvedValue(true),
    };

    await TestBed.configureTestingModule({
      imports: [SelectComponent],
      providers: [
        {provide: ShowService, useValue: showServiceSpy as unknown as ShowService},
        {provide: GlobalSettingsService, useValue: globalSettingsServiceSpy as unknown as GlobalSettingsService},
        {provide: Router, useValue: routerSpy as unknown as Router},
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

    expect(component.visible).toBe(true);
  });

  it('should expose recent shows sorted descending by date', async () => {
    const shows = await firstValueFrom(component.shows$);

    expect(showServiceSpy.list$).toHaveBeenCalledWith(true);
    expect(shows.map(show => show.id)).toEqual(['recent-a', 'recent-b']);
  });

  it('should persist the selected show, trigger presentation reset and navigate', async () => {
    const show = {id: 'show-1'} as never;
    component.visible = true;

    await component.selectShow(show);

    expect(component.visible).toBe(false);
    expect(globalSettingsServiceSpy.set).toHaveBeenCalledWith({currentShow: 'show-1'});
    expect(showServiceSpy.update$).toHaveBeenCalledWith('show-1', {presentationSongId: 'title'});
    expect(routerSpy.navigateByUrl).toHaveBeenCalledWith('/presentation/remote');
  });
});
