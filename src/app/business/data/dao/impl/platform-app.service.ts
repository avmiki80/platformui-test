import {Inject, Injectable, InjectionToken} from '@angular/core';
import {CommonService} from './common.service';
import {PlatformApp} from '../../model/PlatformApp';
import {HttpClient} from '@angular/common/http';
import {SearchDAO} from '../SearchDAO';
import {Observable} from 'rxjs';
import {Role} from '../../../../auth/model/Role';
import {UserSearch} from '../../search/UserSearch';
import {BaseSearch} from '../../search/BaseSearch';

export const PLATFORM_APP_URL_TOKEN = new InjectionToken<string>('url');

@Injectable({
  providedIn: 'root'
})
export class PlatformAppService extends CommonService<PlatformApp> implements SearchDAO<PlatformApp>{

  constructor(
    @Inject(PLATFORM_APP_URL_TOKEN) private baseUrl,
    private http: HttpClient
  ) {
    super(baseUrl, http);
  }

  search(searchObj: UserSearch | BaseSearch): Observable<any> {
    return this.httpClient.post<any>(this.url + '/search', searchObj);
  }
  findRolesByPlatform(id: number): Observable<Role[]> {
    return this.httpClient.post<Role[]>(this.url + '/roles', id);
  }
  searchUserApp(searchObj: UserSearch | BaseSearch): Observable<PlatformApp[]> {
    return this.httpClient.post<PlatformApp[]>(this.url + '/search-user-app', searchObj);
  }

}
