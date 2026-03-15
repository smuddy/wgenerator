import {ComponentFixture, TestBed} from '@angular/core/testing';
import {BadgeComponent} from './badge.component';

describe('BadgeComponent', () => {
  let component: BadgeComponent;
  let fixture: ComponentFixture<BadgeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BadgeComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(BadgeComponent);
    component = fixture.componentInstance;
  });

  it('create an instance', () => {
    void expect(component).toBeTruthy();
  });

  it('should apply the configured type class', () => {
    component.type = 'error';

    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('.badge')?.className).toContain('error');
  });
});
