import {User} from '../../../auth/model/User';

export class Unit {
  id: number;
  name: string;
  parentId: number;
  description: string;
  userList: User[];

  constructor(id: number, name: string, parentId: number, description?: string, userList?: User[]) {
    this.id = id;
    this.name = name;
    this.parentId = parentId;
    this.userList = userList;
    this.description = description;
  }
}
