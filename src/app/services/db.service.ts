import {EnvironmentInjector, Injectable, inject, runInInjectionContext} from '@angular/core';
import {
  addDoc,
  collection,
  collectionData,
  CollectionReference,
  deleteDoc,
  doc,
  docData,
  DocumentData,
  DocumentReference,
  Firestore,
  query,
  QueryConstraint,
  setDoc,
  updateDoc,
  WithFieldValue,
} from '@angular/fire/firestore';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';

type CollectionPredicate<T> = string | DbCollection<T>;
type DocumentPredicate<T> = string | DbDocument<T>;

export class DbCollection<T> {
  public constructor(
    private readonly fs: Firestore,
    private readonly path: string,
    private readonly environmentInjector: EnvironmentInjector
  ) {}

  public add(data: Partial<T>): Promise<DocumentReference<T>> {
    return addDoc(this.ref as CollectionReference<T>, data as WithFieldValue<T>);
  }

  public valueChanges(options?: {idField?: string}): Observable<T[]> {
    return runInInjectionContext(this.environmentInjector, () => collectionData(this.ref, options as {idField?: never}) as Observable<T[]>);
  }

  private get ref(): CollectionReference<DocumentData> {
    return collection(this.fs, this.path);
  }
}

export class DbDocument<T> {
  public constructor(
    private readonly fs: Firestore,
    private readonly path: string,
    private readonly environmentInjector: EnvironmentInjector
  ) {}

  public set(data: Partial<T>): Promise<void> {
    return setDoc(this.ref as DocumentReference<T>, data as WithFieldValue<T>);
  }

  public update(data: Partial<T>): Promise<void> {
    return updateDoc(this.ref, data as Partial<DocumentData>);
  }

  public delete(): Promise<void> {
    return deleteDoc(this.ref);
  }

  public collection<U>(subPath: string): DbCollection<U> {
    return new DbCollection<U>(this.fs, `${this.path}/${subPath}`, this.environmentInjector);
  }

  public valueChanges(options?: {idField?: string}): Observable<(NonNullable<T> & {id?: string}) | undefined> {
    return runInInjectionContext(
      this.environmentInjector,
      () => docData(this.ref as DocumentReference<T>, options as {idField?: never}) as Observable<(NonNullable<T> & {id?: string}) | undefined>
    );
  }

  private get ref(): DocumentReference<DocumentData> {
    return doc(this.fs, this.path);
  }
}

@Injectable({
  providedIn: 'root',
})
export class DbService {
  private fs = inject(Firestore);
  private environmentInjector = inject(EnvironmentInjector);

  public col<T>(ref: CollectionPredicate<T>): DbCollection<T> {
    return typeof ref === 'string' ? new DbCollection<T>(this.fs, ref, this.environmentInjector) : ref;
  }

  public doc<T>(ref: DocumentPredicate<T>): DbDocument<T> {
    return typeof ref === 'string' ? new DbDocument<T>(this.fs, ref, this.environmentInjector) : ref;
  }

  public doc$<T>(ref: DocumentPredicate<T>): Observable<(NonNullable<T> & {id?: string}) | null> {
    return this.doc(ref)
      .valueChanges({idField: 'id'})
      .pipe(map(_ => (_ ? _ : null)));
  }

  public col$<T>(ref: CollectionPredicate<T>, queryConstraints: QueryConstraint[] = []): Observable<T[]> {
    if (typeof ref !== 'string' || queryConstraints.length === 0) {
      return this.col(ref).valueChanges({idField: 'id'});
    }

    const q = query(collection(this.fs, ref), ...queryConstraints);
    return runInInjectionContext(this.environmentInjector, () => collectionData(q, {idField: 'id'}) as Observable<T[]>);
  }
}
