import {ComponentFixture, TestBed} from '@angular/core/testing';

import {ShareDialogComponent} from './share-dialog.component';
import QRCode from 'qrcode';

describe('ShareDialogComponent', () => {
  let component: ShareDialogComponent;
  let fixture: ComponentFixture<ShareDialogComponent>;

  beforeEach(async () => {
    spyOn(QRCode, 'toDataURL').and.resolveTo('data:image/jpeg;base64,test');

    await TestBed.configureTestingModule({
      imports: [ShareDialogComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ShareDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    void expect(component).toBeTruthy();
  });
});
