import {ComponentFixture, TestBed} from '@angular/core/testing';
import {ShareDialogComponent} from './share-dialog.component';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';

describe('ShareDialogComponent', () => {
  let component: ShareDialogComponent;
  let fixture: ComponentFixture<ShareDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShareDialogComponent],
      providers: [
        {
          provide: MAT_DIALOG_DATA,
          useValue: {
            url: 'https://example.com/guest/1',
            show: {
              showType: 'service-worship',
              date: {toDate: () => new Date('2026-03-20T00:00:00Z')},
            },
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ShareDialogComponent);
    component = fixture.componentInstance;
    spyOn<any>(component, 'generateQrCode').and.resolveTo('data:image/jpeg;base64,test');
    fixture.detectChanges();
  });

  it('should create', () => {
    void expect(component).toBeTruthy();
  });
});
