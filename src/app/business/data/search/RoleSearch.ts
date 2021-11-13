import {BaseSearch} from './BaseSearch';
import {Role} from '../../../auth/model/Role';

export class RoleSearch extends BaseSearch{
  viewName: string;
  role: Role;
  constructor(name: string, viewName: string, role?: Role) {
    super(name);
    this.viewName = viewName;
    this.role = role;
  }
}
