// роль пользователя

import {PlatformApp} from '../../business/data/model/PlatformApp';

export class Role {
  id: number;
  name: string;
  application: PlatformApp;
  viewName: string;
  description: string;

  constructor(id: number, name: string, application: PlatformApp, viewName?: string, description?: string) {
    this.id = id;
    this.name = name;
    this.application = application;
    this.viewName = viewName;
    this.description = description;
  }
}
