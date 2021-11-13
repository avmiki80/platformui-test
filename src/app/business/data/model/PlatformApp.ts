
export class PlatformApp {
  id: number;
  name: string;
  appURL: string;
  description: string;

  constructor(id: number, name: string, appURL: string, description?: string) {
    this.id = id;
    this.name = name;
    this.appURL = appURL;
    this.description = description;
  }
}
