import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';

import {ButtonRowComponent} from './button-row.component';

describe('ButtonRowComponent', () => {
  let component: ButtonRowComponent;
  let fixture: ComponentFixture<ButtonRowComponent>;

  beforeEach(
    waitForAsync(() => {
      void TestBed.configureTestingModule({
        declarations: [ButtonRowComponent],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(ButtonRowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    void expect(component).toBeTruthy();
  });
});
