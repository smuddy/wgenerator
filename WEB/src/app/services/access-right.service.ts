import {Injectable} from '@angular/core';
import {AngularFirestore} from '@angular/fire/firestore';
import {map} from 'rxjs/operators';
import {User, UserDB} from './user.model';
import {Observable} from 'rxjs';
import {Role} from './roles.model';
import {RoleDefinitions} from './role.definition';

@Injectable({
    providedIn: 'root'
})
export class AccessRightService {

    constructor(
        private angularFirestore: AngularFirestore
    ) {
    }

    public getUserInfo(userId: string): Observable<User> {
        if (userId === null) {
            return null;
        }

        const user$ = this.angularFirestore
            .collection('/user')
            .doc<UserDB>(userId)
            .valueChanges()
            .pipe
            (map(user => ({
                user: userId,
                role: user.role
            })));

        return user$;
    }

    public userMay(role: Role, requestedRole: Role): boolean {
        const allowedRoles = RoleDefinitions.filter(_ => _.role === requestedRole)[0].when;
        const isAllowed = allowedRoles.indexOf(role) !== -1;

        return isAllowed;
    }
}
