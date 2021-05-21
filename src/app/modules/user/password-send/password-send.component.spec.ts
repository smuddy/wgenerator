import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';

import {PasswordSendComponent} from './password-send.component';

describe('PasswordSendComponent', () => {
  let component: PasswordSendComponent;
  let fixture: ComponentFixture<PasswordSendComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [PasswordSendComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PasswordSendComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
