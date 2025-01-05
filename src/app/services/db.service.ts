import {Injectable} from '@angular/core';
import {AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument} from '@angular/fire/compat/firestore';
import {Observable} from 'rxjs';
import {QueryFn} from '@angular/fire/compat/firestore/interfaces';
import {map} from 'rxjs/operators';

type CollectionPredicate<T> = string | AngularFirestoreCollection<T>;
type DocumentPredicate<T> = string | AngularFirestoreDocument<T>;

@Injectable({
  providedIn: 'root',
})
export class DbService {
  public constructor(private afs: AngularFirestore) {}

  public col<T>(ref: CollectionPredicate<T>, queryFn?: QueryFn): AngularFirestoreCollection<T> {
    return typeof ref === 'string' ? this.afs.collection<T>(ref, queryFn) : ref;
  }

  public doc<T>(ref: DocumentPredicate<T>): AngularFirestoreDocument<T> {
    return typeof ref === 'string' ? this.afs.doc<T>(ref) : ref;
  }

  public doc$<T>(ref: DocumentPredicate<T>): Observable<(NonNullable<T> & {id?: string}) | null> {
    return this.doc(ref)
      .valueChanges({idField: 'id'})
      .pipe(map(_ => (_ ? _ : null)));
  }

  public col$<T>(ref: CollectionPredicate<T>, queryFn?: QueryFn): Observable<T[]> {
    return this.col(ref, queryFn).valueChanges({idField: 'id'});
  }
}
