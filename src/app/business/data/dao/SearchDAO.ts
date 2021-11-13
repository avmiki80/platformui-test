import {Observable} from 'rxjs';
import {UserSearch} from '../search/UserSearch';
import {BaseSearch} from '../search/BaseSearch';
import {RoleSearch} from '../search/RoleSearch';

export interface SearchDAO<T> {
  search(searchObj: BaseSearch | UserSearch | RoleSearch): Observable<T[]>;
}
