import {ComponentFixture, TestBed} from '@angular/core/testing';

import {PageFrameComponent} from './page-frame.component';

describe('SidebarComponent', () => {
  let component: PageFrameComponent;
  let fixture: ComponentFixture<PageFrameComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PageFrameComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PageFrameComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should toggle and close the sidebar', () => {
    expect(component.collapsed).toBeTrue();

    component.toggle();
    expect(component.collapsed).toBeFalse();

    component.close();
    expect(component.collapsed).toBeTrue();
  });
});
