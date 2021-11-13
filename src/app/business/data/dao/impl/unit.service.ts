import {Inject, Injectable, InjectionToken} from '@angular/core';
import {CommonService} from './common.service';
import {Unit} from '../../model/Unit';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {UnitNode} from '../../model/UnitNode';
import {SearchDAO} from '../SearchDAO';
import {BaseSearch} from '../../search/BaseSearch';

export const UNIT_URL_TOKEN = new InjectionToken<string>('url');

@Injectable({
  providedIn: 'root'
})
export class UnitService extends CommonService<Unit> implements SearchDAO<Unit>{
  constructor(
    @Inject(UNIT_URL_TOKEN) private baseUrl,
    private http: HttpClient
  ) {
    super(baseUrl, http);
  }
  getTreeUnits(): Observable<UnitNode> {
    return this.httpClient.post<UnitNode>(this.url + '/tree', null);
  }

  search(searchObj: BaseSearch): Observable<any> {
    return this.httpClient.post<any>(this.url + '/search', searchObj);
  }
  getUnitByUserId(userId: number): Observable<Unit>{
    return this.http.post<Unit>(this.url + '/unit', userId);
  }
}
