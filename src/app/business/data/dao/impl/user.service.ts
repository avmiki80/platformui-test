import {Inject, Injectable, InjectionToken} from '@angular/core';
import {CommonService} from './common.service';
import {HttpClient} from '@angular/common/http';
import {User} from '../../../../auth/model/User';
import {SearchDAO} from '../SearchDAO';
import {Observable} from 'rxjs';
import {UserSearch} from '../../search/UserSearch';

export const USER_URL_TOKEN = new InjectionToken<string>('url');

@Injectable({
  providedIn: 'root'
})
export class UserService extends CommonService<User> implements SearchDAO<User>{

  constructor(
    @Inject(USER_URL_TOKEN) private baseUrl,
    private http: HttpClient
  ) {
    super(baseUrl, http);
  }

  search(searchObj: UserSearch): Observable<any> {
    return this.http.post<any>(this.url + '/search', searchObj);
  }
}
