import {Injectable} from '@angular/core';
import {AngularFireAuth} from '@angular/fire/auth';
import {from, Observable, of, OperatorFunction} from 'rxjs';
import {AccessRightService} from './access-right.service';
import {catchError, map, switchMap, tap} from 'rxjs/operators';
import {User} from './user.model';
import {Role} from './roles.model';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private _user: User = null;

    constructor(
        private angularFireAuth: AngularFireAuth,
        private accessRightService: AccessRightService
    ) {
        angularFireAuth.authState.subscribe(_ => console.log(_));
    }

    public login$(user: string, pass: string): Observable<User> {
        const authPromise = this.angularFireAuth.auth.signInWithEmailAndPassword(user, pass);
        const auth$ = from(authPromise).pipe(
            map(_ => _.user.uid),
            this.processLogin()
        );

        return auth$;
    }

    public getUser$(): Observable<User> {
        if (this._user) {
            return of(this._user);
        }

        return this.angularFireAuth.authState.pipe(
            map(_ => _ ? _.uid : null),
            this.processLogin()
        );
    }

    public userMay$(requestedRole: Role): Observable<boolean> {
        const allowed$ = this.getUser$().pipe(
            map(_ => _ ? this.accessRightService.userMay(_.role, requestedRole) : false)
        );

        return allowed$;
    }

    private processLogin(): OperatorFunction<string, User> {
        const self = this;
        return function (source$: Observable<string>): Observable<User> {
            return source$.pipe(
                switchMap(_ => self.accessRightService.getUserInfo(_)),
                tap((_ => self._user = _)),
                catchError(_ => {
                    self._user = null;
                    return of(null);
                })
            );
        };
    }
}
