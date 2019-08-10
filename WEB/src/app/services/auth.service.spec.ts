import {fakeAsync, TestBed, tick} from '@angular/core/testing';

import {AuthService} from './auth.service';
import {of} from 'rxjs';
import {Role} from './roles.model';
import {AccessRightService} from './access-right.service';
import {AngularFireAuth} from '@angular/fire/auth';

describe('AuthService', () => {
    const mockAccessRightService = {
        getUserInfo: () => of({
            user: 'userid',
            role: Role.reader
        })
    };
    const mockAngularFireAuth = {
        auth: {
            signInWithEmailAndPassword: Promise.resolve({user: {uid: 'userid'}})
        }
    };
    beforeEach(() => TestBed.configureTestingModule({
        providers: [
            {provide: AccessRightService, useValue: mockAccessRightService},
            {provide: AngularFireAuth, useValue: mockAngularFireAuth},
        ]
    }));

    it('should be created', () => {
        const service: AuthService = TestBed.get(AuthService);
        expect(service).toBeTruthy();
    });

    it('should be created', fakeAsync(() => {
        const service: AuthService = TestBed.get(AuthService);
        const authSpy = spyOn(TestBed.get(AngularFireAuth).auth, 'signInWithEmailAndPassword');
        const accessSpy = spyOn(TestBed.get(AccessRightService), 'getUserInfo');
        service.login$('user', 'pass');

        expect(authSpy).toHaveBeenCalledWith('user', 'pass');
        tick();
        expect(accessSpy).toHaveBeenCalledWith('userid');
        tick();
        expect(service.user.user).toBe('userid');
        expect(service.user.user).toBe(Role.reader);

    }));
});
