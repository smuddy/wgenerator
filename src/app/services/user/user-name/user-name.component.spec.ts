import {ComponentFixture, TestBed} from '@angular/core/testing';
import {firstValueFrom, of} from 'rxjs';
import {beforeEach, describe, expect, it, vi} from 'vitest';
import {UserService} from '../user.service';
import {UserNameComponent} from './user-name.component';

describe('UserNameComponent', () => {
  let component: UserNameComponent;
  let fixture: ComponentFixture<UserNameComponent>;
  let userServiceSpy: {getUserbyId$: ReturnType<typeof vi.fn>};

  beforeEach(async () => {
    userServiceSpy = {getUserbyId$: vi.fn()};
    userServiceSpy.getUserbyId$.mockReturnValue(of({name: 'Benjamin'} as never));

    await TestBed.configureTestingModule({
      imports: [UserNameComponent],
      providers: [{provide: UserService, useValue: userServiceSpy}],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserNameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should resolve the user name when the userId input changes', async () => {
    component.userId = 'user-1';

    expect(userServiceSpy.getUserbyId$).toHaveBeenCalledWith('user-1');
    await expect(firstValueFrom(component.name$!)).resolves.toEqual('Benjamin');
  });

  it('should map missing users to null names', async () => {
    userServiceSpy.getUserbyId$.mockReturnValue(of(null));

    component.userId = 'missing-user';

    await expect(firstValueFrom(component.name$!)).resolves.toEqual(null);
  });
});
