import {ComponentFixture, TestBed} from '@angular/core/testing';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
import {ReportDialogComponent} from './report-dialog.component';

describe('ReportDialogComponent', () => {
  let component: ReportDialogComponent;
  let fixture: ComponentFixture<ReportDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReportDialogComponent],
      providers: [
        {
          provide: MAT_DIALOG_DATA,
          useValue: {songs: [{title: 'Amazing Grace', ccliNumber: '12345'}]},
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ReportDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('create an instance', () => {
    void expect(component).toBeTruthy();
  });

  it('should build direct reporting urls', () => {
    expect(component.getSongReportingUrl('5770492')).toBe('https://reporting.ccli.com/search?s=5770492');
  });

  it('should mark numbers as opened locally', () => {
    expect(component.wasOpened('12345')).toBeFalse();

    component.markOpened('12345');

    expect(component.wasOpened('12345')).toBeTrue();
  });
});
