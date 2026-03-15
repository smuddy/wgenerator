import {ComponentFixture, TestBed} from '@angular/core/testing';
import {ActivatedRoute, Router} from '@angular/router';
import {Timestamp} from '@angular/fire/firestore';
import {of} from 'rxjs';
import {ShowDataService} from '../services/show-data.service';
import {ShowService} from '../services/show.service';
import {EditComponent} from './edit.component';

describe('EditComponent', () => {
  let component: EditComponent;
  let fixture: ComponentFixture<EditComponent>;
  let showServiceSpy: jasmine.SpyObj<ShowService>;
  let showDataServiceStub: Pick<ShowDataService, 'list$'>;
  let routerSpy: jasmine.SpyObj<Router>;
  const createDate = (isoDate: string) => ({toDate: () => new Date(isoDate)});

  beforeEach(async () => {
    showServiceSpy = jasmine.createSpyObj<ShowService>('ShowService', ['read$', 'update$']);
    showDataServiceStub = {list$: of([]) as ShowDataService['list$']};
    routerSpy = jasmine.createSpyObj<Router>('Router', ['navigateByUrl']);

    showServiceSpy.read$.and.returnValue(
      of({
        id: 'show-1',
        showType: 'service-worship',
        date: createDate('2026-03-10T00:00:00Z'),
      } as never)
    );
    showServiceSpy.update$.and.resolveTo();
    routerSpy.navigateByUrl.and.resolveTo(true);

    await TestBed.configureTestingModule({
      imports: [EditComponent],
      providers: [
        {provide: ShowService, useValue: showServiceSpy},
        {provide: ShowDataService, useValue: showDataServiceStub},
        {provide: Router, useValue: routerSpy},
        {provide: ActivatedRoute, useValue: {params: of({showId: 'show-1'})}},
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(EditComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load the current show into the form on init', () => {
    component.ngOnInit();

    expect(showServiceSpy.read$).toHaveBeenCalledWith('show-1');
    expect(component.form.value.id).toBe('show-1');
    expect(component.form.value.showType).toBe('service-worship');
    expect(component.form.value.date).toEqual(new Date('2026-03-10T00:00:00Z'));
  });

  it('should not save when the form is invalid', async () => {
    component.form.setValue({id: null, date: null, showType: null});

    await component.onSave();

    expect(showServiceSpy.update$).not.toHaveBeenCalled();
    expect(routerSpy.navigateByUrl).not.toHaveBeenCalled();
  });

  it('should update the show and navigate back to the detail page', async () => {
    const date = new Date('2026-03-11T00:00:00Z');
    const firestoreTimestamp = {seconds: 1} as never;
    spyOn(Timestamp, 'fromDate').and.returnValue(firestoreTimestamp);
    component.form.setValue({id: 'show-1', date, showType: 'home-group'});

    await component.onSave();

    expect(Timestamp.fromDate).toHaveBeenCalledWith(date);
    expect(showServiceSpy.update$).toHaveBeenCalledWith('show-1', {
      date: firestoreTimestamp,
      showType: 'home-group',
    } as never);
    expect(routerSpy.navigateByUrl).toHaveBeenCalledWith('/shows/show-1');
  });
});
