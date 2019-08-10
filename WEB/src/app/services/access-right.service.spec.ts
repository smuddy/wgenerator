import {async, TestBed} from '@angular/core/testing';

import {AccessRightService} from './access-right.service';
import {AngularFirestore} from '@angular/fire/firestore';
import {of} from 'rxjs';
import {Role} from './roles.model';

describe('AccessRightService', () => {
    const mockAngularFirestore = {
        collection: () => ({
            doc: () => ({
                valueChanges: () => of({
                    role: 'reader'
                })
            })
        })
    };

    beforeEach(() => TestBed.configureTestingModule({
        providers: [
            {provide: AngularFirestore, useValue: mockAngularFirestore}
        ]
    }));

    it('should be created', () => {
        const service: AccessRightService = TestBed.get(AccessRightService);
        expect(service).toBeTruthy();
    });

    it('should get user', async(() => {
        const service: AccessRightService = TestBed.get(AccessRightService);
        service.getUserInfo('userid').subscribe(_ => {
            expect(_).toEqual({
                user: 'userid',
                role: Role.reader
            });
        });
    }));


});
