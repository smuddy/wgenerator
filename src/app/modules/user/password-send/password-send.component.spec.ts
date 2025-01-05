import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';

import {PasswordSendComponent} from './password-send.component';

describe('PasswordSendComponent', () => {
  let component: PasswordSendComponent;
  let fixture: ComponentFixture<PasswordSendComponent>;

  beforeEach(waitForAsync(() => {
    void TestBed.configureTestingModule({
      imports: [PasswordSendComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PasswordSendComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    void expect(component).toBeTruthy();
  });
});
