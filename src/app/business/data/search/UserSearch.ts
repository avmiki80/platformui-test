import {BaseSearch} from './BaseSearch';

export class UserSearch extends BaseSearch{
  email: string;
  username: string;
  unitId: number;

  constructor(username: string, email: string, unitId?: number) {
    super(null);
    this.email = email;
    this.username = username;
    this.unitId = unitId;
  }
}
