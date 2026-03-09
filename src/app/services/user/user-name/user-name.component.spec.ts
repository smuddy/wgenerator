import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {of} from 'rxjs';
import {UserService} from '../user.service';
import {UserNameComponent} from './user-name.component';

describe('UserNameComponent', () => {
  let component: UserNameComponent;
  let fixture: ComponentFixture<UserNameComponent>;
  let userServiceSpy: jasmine.SpyObj<UserService>;

  beforeEach(waitForAsync(() => {
    userServiceSpy = jasmine.createSpyObj<UserService>('UserService', ['getUserbyId$']);
    userServiceSpy.getUserbyId$.and.returnValue(of({name: 'Benjamin'} as never));

    void TestBed.configureTestingModule({
      imports: [UserNameComponent],
      providers: [{provide: UserService, useValue: userServiceSpy}],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserNameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should resolve the user name when the userId input changes', done => {
    component.userId = 'user-1';

    component.name$?.subscribe(name => {
      expect(userServiceSpy.getUserbyId$).toHaveBeenCalledWith('user-1');
      expect(name).toBe('Benjamin');
      done();
    });
  });

  it('should map missing users to null names', done => {
    userServiceSpy.getUserbyId$.and.returnValue(of(null));

    component.userId = 'missing-user';

    component.name$?.subscribe(name => {
      expect(name).toBeNull();
      done();
    });
  });
});
