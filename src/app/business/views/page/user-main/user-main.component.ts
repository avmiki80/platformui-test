import { Component, OnInit } from '@angular/core';
import {DeviceDetectorService} from 'ngx-device-detector';
import {PlatformAppService} from '../../../data/dao/impl/platform-app.service';
import {TranslateService} from '@ngx-translate/core';
import {UserSearch} from '../../../data/search/UserSearch';
import {PlatformApp} from '../../../data/model/PlatformApp';
import {User} from '../../../../auth/model/User';
import {AuthService} from '../../../../auth/service/auth.service';
import {LANG_RU} from "../../../../app.constant";

// export const LANG_RU = 'ru';
// export const LANG_EN = 'en';

@Component({
  selector: 'app-user-main',
  templateUrl: './user-main.component.html',
  styleUrls: ['./user-main.component.css']
})
export class UserMainComponent implements OnInit {
  user: User;
  isMobile: boolean;
  isLoading: boolean;
  menuOpened: boolean;
  menuMode: string;
  menuPosition: string;
  showBackdrop: boolean;
  platformAppSet: PlatformApp[];

  constructor(
    private deviceDetectorService: DeviceDetectorService,
    private authService: AuthService,
    private platformAppService: PlatformAppService,
    private translateService: TranslateService
    ) { }

  ngOnInit(): void {
    this.isMobile = this.deviceDetectorService.isMobile();
    this.translateService.use(LANG_RU);
    this.isLoading = true;
    this.initSideBar(); // начальная загрузка ng-sidebar
    this.authService.currentUser.subscribe(result => {
      this.user = result;
      if (this.user){
        this.platformAppService.searchUserApp(new UserSearch(this.user.username, null)).subscribe(data => {
          this.platformAppSet = data.filter(app => app.name !== 'Платформа');
          this.isLoading = false;
        });
      }
    });
    // this.translateService.use(LANG_RU);
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
  onSelectApp(app: PlatformApp): void{

  }
}
