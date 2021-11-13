import {Component, Input, OnInit} from '@angular/core';
import {PlatformApp} from '../../../../data/model/PlatformApp';
import {PlatformAppService} from '../../../../data/dao/impl/platform-app.service';
import {DeviceDetectorService} from 'ngx-device-detector';
import {TranslateService} from '@ngx-translate/core';
import {Role} from '../../../../../auth/model/Role';
import {User} from '../../../../../auth/model/User';
import {BaseSearch} from '../../../../data/search/BaseSearch';
import {MessageDialogComponent} from '../../../dialog/message-dialog/message-dialog.component';
import {MatDialog} from '@angular/material/dialog';
import {PageEvent} from '@angular/material/paginator';
import {RoleSearch} from '../../../../data/search/RoleSearch';

@Component({
  selector: 'app-application-view',
  templateUrl: './application-view.component.html',
  styleUrls: ['./application-view.component.css']
})
export class ApplicationViewComponent implements OnInit {
  isShow: boolean;
  isMobile: boolean;
  isLoading: boolean;
  platformAppSet: PlatformApp[];
  roleSet: Role[];
  selectPlatformApp: PlatformApp;
  appSearchValues: BaseSearch;
  roleSearchValues: RoleSearch;
  totalAppsFounded: number;
  totalRolesFromSelectedApp: number;
  user: User;
  @Input('user')
  set setUser(user: User){
    this.user = user;
    if (this.isShow){
      this.searchPlatformApp();
    }
  }
  @Input('show')
  set setShowView(isShow: boolean){
    this.isShow = isShow;
    if (this.user){
      this.searchPlatformApp();
    }
  }

  constructor(
    private platformAppService: PlatformAppService,
    private deviceDetectorService: DeviceDetectorService,
    private translateService: TranslateService,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.isMobile = this.deviceDetectorService.isMobile();
    this.selectPlatformApp = null;
    this.initAppSearch(null);
    this.roleSearchValues = new RoleSearch(null, null);
  }

  initAppSearch(name: string): void {
    if (!name) { name = ''; }
    this.appSearchValues = new BaseSearch(name);
  }
  searchPlatformApp(appSearchValues?: BaseSearch): void{
    if (this.user){
      this.isLoading = true;
      if (!this.appSearchValues) {
        this.initAppSearch(null);
      }
      if (appSearchValues) {
        this.appSearchValues = appSearchValues;
      }
      this.platformAppService.search(this.appSearchValues).subscribe(data => {
        this.platformAppSet = data.content;
        this.totalAppsFounded = data.totalElements;

        let detectedPlatformApp = this.platformAppSet[0];
        if (this.selectPlatformApp) {
          const detectedPlatformAppTemp = this.platformAppSet.find(value => value.id === this.selectPlatformApp.id);
          if (detectedPlatformAppTemp) {
                this.selectPlatformApp = detectedPlatformAppTemp;
                detectedPlatformApp = detectedPlatformAppTemp;
          }
        }
        this.onSelectPlatformApp(detectedPlatformApp);
        this.isLoading = false;
      });
    }
  }
  onAddPlatformApp(platformApp: PlatformApp): void{
    if (platformApp) {
      this.isLoading = true;
      this.platformAppService.add(platformApp).subscribe(resultPlatformApp => {
        this.selectPlatformApp = resultPlatformApp;
        if (!platformApp.name.toUpperCase().includes(this.appSearchValues.name.toUpperCase())) {
          this.initAppSearch(null);
        }
        this.searchPlatformApp();
        this.isLoading = false;
      });
    }
  }
  onEditPlatformApp(platformApp: PlatformApp): void{
    if (platformApp){
      this.isLoading = true;
      this.selectPlatformApp = platformApp;
      this.platformAppService.update(platformApp).subscribe(resultStatus => {
        if (!platformApp.name.toUpperCase().includes(this.appSearchValues.name.toUpperCase())) {
          this.initAppSearch(null);
        }
        this.searchPlatformApp(this.appSearchValues);
        this.isLoading = false;
      });
    }
  }
  onDeletePlatformApp(platformApp: PlatformApp): void{
    if (platformApp){
      this.isLoading = true;
      this.platformAppService.delete(platformApp.id).subscribe(resultStatus => {
        this.selectPlatformApp = null;
        if (this.platformAppSet.length === 1) {
          if (this.appSearchValues.pageNumber > 0) {
            this.appSearchValues.pageNumber --;
          }
          else {
            this.initAppSearch(null);
          }
        }
        this.searchPlatformApp();
        this.isLoading = false;
      }, error => {
        switch (error.error.exception) {
          case 'UnexpectedRollbackException': {
            const dialogRef = this.dialog.open(MessageDialogComponent, {
              autoFocus: false,
              restoreFocus: false,
              width: '500px',
              data: {
                dialogTitle: this.translateService.instant('COMMON.ERROR'),
                message: this.translateService.instant('APP.ERROR-DELETE')
              }
            });
            break;
          }
          default: {
            const dialogRef = this.dialog.open(MessageDialogComponent, {
              autoFocus: false,
              restoreFocus: false,
              width: '500px',
              data: {
                dialogTitle: this.translateService.instant('COMMON.ERROR'),
                message: error.error.exception
              }
            });
            break;
          }
        }
      });
    }
  }
  onSelectPlatformApp(platformApp: PlatformApp): void{
    if (platformApp){
      this.isLoading = true;
      this.selectPlatformApp = platformApp;
      this.platformAppService.findById(platformApp.id).subscribe(result => {
        this.platformAppService.findRolesByPlatform(platformApp.id).subscribe(roles => {
          this.roleSet = roles;
          if (roles){
            this.totalRolesFromSelectedApp = roles.length;
          }
        });
        this.isLoading = false;
      });
    }
    else {
      this.roleSet = null;
    }
  }
  paging(pageEvent: PageEvent): void{
    if (this.appSearchValues.pageSize !== pageEvent.pageSize){
      this.appSearchValues.pageNumber = 0;
    } else {
      this.appSearchValues.pageNumber = pageEvent.pageIndex;
    }
    this.appSearchValues.pageSize = pageEvent.pageSize;
    this.selectPlatformApp = null; // при смене странички обнуляется выбранное приложение
    this.searchPlatformApp();
  }
}
