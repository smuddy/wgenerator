import {ComponentFixture, TestBed} from '@angular/core/testing';

import {PasswordSendComponent} from './password-send.component';

describe('PasswordSendComponent', () => {
  let component: PasswordSendComponent;
  let fixture: ComponentFixture<PasswordSendComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PasswordSendComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PasswordSendComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    void expect(component).toBeTruthy();
  });
});
