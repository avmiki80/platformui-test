import {Component, Input, OnInit, Output, EventEmitter} from '@angular/core';
import {PlatformApp} from '../../../data/model/PlatformApp';
import {DeviceDetectorService} from 'ngx-device-detector';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-user-menu',
  templateUrl: './user-menu.component.html',
  styleUrls: ['./user-menu.component.css']
})
export class UserMenuComponent implements OnInit {
  isMobile: boolean;
  selectedApp: PlatformApp;
  applicationList: PlatformApp[];
  @Input('applicationList')
  set setSectionList(applicationList: PlatformApp[]){
    this.applicationList = applicationList;
    if (this.applicationList){
      this.selectedApp = this.applicationList[0];
      this.selectApp.emit(this.selectedApp);
    }
  }
  @Output()
  selectApp = new EventEmitter<PlatformApp>();
  @Output()
  menuShow = new EventEmitter();

  constructor(
    private deviceDetectorService: DeviceDetectorService,
    private translateService: TranslateService,

  ) { }

  ngOnInit(): void {
    this.isMobile = this.deviceDetectorService.isMobile();
  }
  onShowLeftMenu(): void{
    this.menuShow.emit();
  }
  onSelectApp(app: PlatformApp): void{
    if (app){
      this.selectedApp = app;
      this.selectApp.emit(this.selectedApp);
    }
  }
}
