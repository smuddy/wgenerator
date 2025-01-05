import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';

import {FilterComponent} from './filter.component';

describe('FilterComponent', () => {
  let component: FilterComponent;
  let fixture: ComponentFixture<FilterComponent>;

  beforeEach(
    waitForAsync(() => {
      void TestBed.configureTestingModule({
    imports: [FilterComponent],
}).compileComponents();
    }),
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(FilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    void expect(component).toBeTruthy();
  });
});
