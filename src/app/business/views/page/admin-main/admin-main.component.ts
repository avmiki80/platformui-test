import { Component, OnInit } from '@angular/core';
import {DeviceDetectorService} from 'ngx-device-detector';
import {TranslateService} from '@ngx-translate/core';
import {User} from '../../../../auth/model/User';
import {AuthService} from '../../../../auth/service/auth.service';
import {LANG_RU} from '../../../../app.constant';

@Component({
  selector: 'app-admin-main',
  templateUrl: './admin-main.component.html',
  styleUrls: ['./admin-main.component.css']
})
export class AdminMainComponent implements OnInit {
  user: User;
  isMobile: boolean;
  isLoading: boolean;
  showAppView: boolean;
  showRoleView: boolean;
  showUserView: boolean;
  currentItem: number;

  menuOpened: boolean;
  menuMode: string;
  menuPosition: string;
  showBackdrop: boolean;
  menuItemList: string[];

  constructor(
    private deviceDetectorService: DeviceDetectorService,
    private authService: AuthService,
    private translateService: TranslateService
  ) { }

  ngOnInit(): void {
    this.isMobile = this.deviceDetectorService.isMobile();
    this.isLoading = true;
    this.currentItem = 0;
    this.showAppView = true;
    this.showRoleView = false;
    this.showUserView = false;
    this.translateService.use(LANG_RU);
    this.translateService.get(['APP.APPLICATIONS', 'ROLE.ROLES', 'USER.USERS']).subscribe((result: string) => {
      this.menuItemList = [];
      this.menuItemList.push(result['APP.APPLICATIONS']);
      this.menuItemList.push(result['ROLE.ROLES']);
      this.menuItemList.push(result['USER.USERS']);
    });

    this.authService.currentUser.subscribe(result => {
      this.user = result;
      this.isLoading = false;
    });
    this.initSideBar(); // начальная загрузка ng-sidebar
  }
  initSideBar(): void{
    this.menuPosition = 'left'; // меню слева
    // настройки бокового меню для моб. и десктоп вариантов
    if (this.isMobile) {
      this.menuOpened = false; // на моб. версии по-умолчанию меню будет закрыто
      this.menuMode = 'over'; // поверх всего контента
      this.showBackdrop = true; // если нажали на область вне меню - закрыть его
    } else {
      this.menuOpened = true; // НЕ в моб. версии по-умолчанию меню будет открыто (т.к. хватает места)
      this.menuMode = 'push'; // будет "толкать" основной контент, а не закрывать его
      this.showBackdrop = false;
    }
  }
  toggleMenu(): void{
    this.menuOpened = ! this.menuOpened;
  }
  showView(item: number): void{
    this.currentItem = item;
    switch (this.currentItem) {
      case 0: {
        this.showAppView = true;
        this.showRoleView = false;
        this.showUserView = false;
        break;
      }
      case 1: {
        this.showAppView = false;
        this.showRoleView = true;
        this.showUserView = false;
        break;
      }
      case 2: {
        this.showAppView = false;
        this.showRoleView = false;
        this.showUserView = true;
        break;
      }
      default: {
        this.showAppView = true;
        this.showRoleView = false;
        this.showUserView = false;
        break;
      }
    }
  }
}
