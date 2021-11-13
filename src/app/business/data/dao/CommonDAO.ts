import {Observable} from 'rxjs';

export interface CommonDAO<T> {
  add(obj: T): Observable<T>;
  update(obj: T): Observable<any>;
  findById(id: number): Observable<T>;
  delete(id: number): Observable<any>;
  findAll(email: string): Observable<T[]>;
}
