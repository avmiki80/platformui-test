import { Injectable } from '@angular/core';
import {BaseService} from './base.service';
import {CommonDAO} from '../CommonDAO';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CommonService<T> extends BaseService implements CommonDAO<T>{

  constructor(url: string, httpClient: HttpClient) {
    super(url, httpClient);
  }

  add(obj: T): Observable<T> {
    return this.httpClient.put<T>(this.url + '/add', obj);
  }

  delete(id: number): Observable<any> {
    return this.httpClient.post<any>(this.url + '/delete', id);
  }

  findAll(): Observable<T[]> {
    return this.httpClient.post<T[]>(this.url + '/all', null);
  }

  findById(id: number): Observable<T> {
    return this.httpClient.post<T>(this.url + '/id', id);
  }

  update(obj: T): Observable<any> {
    return this.httpClient.patch<any>(this.url + '/update', obj);
  }
}
