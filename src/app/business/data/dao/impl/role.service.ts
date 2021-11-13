import {Inject, Injectable, InjectionToken} from '@angular/core';
import {CommonService} from './common.service';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Role} from '../../../../auth/model/Role';
import {User} from '../../../../auth/model/User';
import {SearchDAO} from '../SearchDAO';
import {RoleSearch} from '../../search/RoleSearch';

export const ROLE_URL_TOKEN = new InjectionToken<string>('url');

@Injectable({
  providedIn: 'root'
})
export class RoleService extends CommonService<Role> implements SearchDAO<Role>{

  constructor(
    @Inject(ROLE_URL_TOKEN) private baseUrl,
    private http: HttpClient
  ) {
    super(baseUrl, http);
  }
  findUsersByRole(searchObj: RoleSearch): Observable<any> {
    return this.httpClient.post<any>(this.url + '/users', searchObj);
  }

  search(searchObj: RoleSearch): Observable<any> {
    return this.http.post<any>(this.url + '/search', searchObj);
  }
}
