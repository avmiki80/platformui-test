import {Component, Input, OnInit} from '@angular/core';
import {DeviceDetectorService} from 'ngx-device-detector';
import {UserService} from '../../../../data/dao/impl/user.service';
import {TranslateService} from '@ngx-translate/core';
import {User} from '../../../../../auth/model/User';
import {Role} from '../../../../../auth/model/Role';
import {UnitService} from '../../../../data/dao/impl/unit.service';
import {Unit} from '../../../../data/model/Unit';
import {UnitNode} from '../../../../data/model/UnitNode';
import {UserSearch} from '../../../../data/search/UserSearch';
import {MatDialog} from '@angular/material/dialog';
import {MessageDialogComponent} from '../../../dialog/message-dialog/message-dialog.component';
import {DEFAULT_PAGE_NUMBER, DEFAULT_PAGE_SIZE} from '../../../../../app.constant';
import {PageEvent} from '@angular/material/paginator';

@Component({
  selector: 'app-user-view',
  templateUrl: './user-view.component.html',
  styleUrls: ['./user-view.component.css']
})
export class UserViewComponent implements OnInit {
  isMobile: boolean;
  isLoading: boolean;
  selectUser: User;
  selectUnit: Unit;
  wildUserList: User[];
  unitUserList: User[];
  roleSet: Role[];
  unitList: Unit[];
  unitTree: UnitNode;

  readonly defaultSortColumn = 'username';
  userSearchValues: UserSearch;
  wildUserSearchValues: UserSearch;
  totalUsersFounded: number;
  totalWildUsersFounded: number;
  toggleTab: boolean;

  user: User;
  @Input('user')
  set setUser(user: User){
    this.user = user;
    if (this.isShow){
    }
  }

  isShow: boolean;
  @Input('show')
  set setShowView(isShow: boolean){
    this.isShow = isShow;
  }

  constructor(
    private deviceDetectorService: DeviceDetectorService,
    private userService: UserService,
    private unitService: UnitService,
    private translateService: TranslateService,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.isMobile = this.deviceDetectorService.isMobile();
    this.selectUser = null;
    this.updateTree();
    this.initUserSearch(null, null, null);
    this.initWildUserSearch(null, null);
    this.toggleTab = false;
    this.onRefreshWildUserList();
  }
  onTabClick(): void{
    this.toggleTab = !this.toggleTab;
    if (this.toggleTab){
      this.onRefreshWildUserList();
    }
  }

  updateTree(): void{
    this.unitService.getTreeUnits().subscribe(result => {
      this.unitTree = result;
    });
  }

  onAddUnit(unit: Unit): void{
    if (unit){
      this.unitService.add(unit).subscribe(result => {
        this.updateTree();
      });
    }
  }
  onEditUnit(unit: Unit): void{
    if (unit){
      this.unitService.update(unit).subscribe(result => {
        this.updateTree();
      });
    }
  }
  onDeleteUnit(unit: Unit): void{
    if (unit){
      this.unitService.delete(unit.id).subscribe(result => {
        this.selectUnit = null;
        this.updateTree();
      }, error => {
        switch (error.error.exception) {
          case 'UnexpectedRollbackException': {
            const dialogRef = this.dialog.open(MessageDialogComponent, {
              autoFocus: false,
              restoreFocus: false,
              width: '500px',
              data: {
                dialogTitle: this.translateService.instant('COMMON.ERROR'),
                message: this.translateService.instant('UNIT.ERROR-DELETE')
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
  onSelectUnit(unit: Unit): void{
    this.userSearchValues.pageNumber = 0;
    this.selectUnit = unit;
    this.userSearchValues.unitId = this.selectUnit.id;
    this.onSearchUser();
  }

  initUserSearch(username: string, email: string, unitId: number): void {
    if (!username) { username = ''; }
    if (!email) { email = ''; }
    this.userSearchValues = new UserSearch(username, email, unitId);
    this.userSearchValues.sortColumn = this.defaultSortColumn;
  }
  initWildUserSearch(username: string, email: string): void {
    if (!username) { username = ''; }
    if (!email) { email = ''; }
    this.wildUserSearchValues = new UserSearch(username, email);
    this.wildUserSearchValues.sortColumn = this.defaultSortColumn;
  }
  onSearchUser(userSearchValues?: UserSearch): void {
    if (this.selectUnit) {
      this.isLoading = true;
      if (!this.userSearchValues) {
        this.initUserSearch(null, null, null);
      }
      if (userSearchValues) {
        this.userSearchValues = userSearchValues;
      }
      this.userService.search(this.userSearchValues).subscribe(result => {
        this.unitUserList = result.content;
        this.totalUsersFounded = result.totalElements;

        let detectedUser = this.unitUserList[0];
        if (this.selectUser) {
          const detectedUserTemp = this.unitUserList.find(value => value.id === this.selectUser.id);
          if (detectedUserTemp) {
            this.selectUser = detectedUserTemp;
            detectedUser = detectedUserTemp;
          }
        }
        this.onSelectPlatformUser(detectedUser);
        this.isLoading = false;
      });
    }
  }
  onAddPlatformUser(platformUser: User): void {
    if (platformUser) {
      this.isLoading = true;
      this.userService.add(platformUser).subscribe(user => {
        this.selectUser = user;
        this.roleSet = user.roleSet;
        if (this.selectUnit) {
          if (!platformUser.username.toUpperCase().includes(this.userSearchValues.username.toUpperCase())) {
            this.initUserSearch(null, null, this.selectUnit.id);
          }
          this.onSearchUser();
        }
        this.isLoading  = false;
      });
    }
  }
  onEditPlatformUser(platformUser: User): void{
    if (platformUser) {
      this.isLoading = true;
      this.selectUser = platformUser;
      this.roleSet = this.selectUser.roleSet;
      this.userService.update(platformUser).subscribe(resultStatus => {
        this.onRefreshWildUserList();
        if (this.selectUnit) {
          if (!platformUser.username.toUpperCase().includes(this.userSearchValues.username.toUpperCase())) {
            this.initUserSearch(null, null, this.selectUnit.id);
          }
          this.onSearchUser();
        }
        this.isLoading  = false;
      });
    }
  }
  onDeletePlatformUser(platformUser: User): void{
    if (platformUser) {
      this.isLoading = true;
      this.userService.delete(platformUser.id).subscribe(resultStatus => {
        this.selectUser = null;
        this.onRefreshWildUserList();
        if (this.selectUnit) {
          if (this.unitUserList.length === 1) {
            if (this.userSearchValues.pageNumber > 0) {
              this.userSearchValues.pageNumber --;
            }
            else {
              this.initUserSearch(null, null, this.selectUnit.id);
            }
          }

          this.onSearchUser();
        }
        this.isLoading  = false;
      });
    }
  }
  onSelectPlatformUser(platformUser: User): void{
    if (platformUser){
      this.isLoading = true;
      this.selectUser = platformUser;
      this.userService.findById(platformUser.id).subscribe(result => {
        this.roleSet = this.selectUser.roleSet;
        this.isLoading = false;
      });
    }
  }
  pagingUsers(pageEvent: PageEvent): void{
    if (this.userSearchValues.pageSize !== pageEvent.pageSize){
      this.userSearchValues.pageNumber = 0;
    } else {
      this.userSearchValues.pageNumber = pageEvent.pageIndex;
    }
    this.userSearchValues.pageSize = pageEvent.pageSize;
    this.selectUser = null;
    this.onSearchUser();
  }

  // данный метод просто каждый раз при добавлении изменении удалении формирует запрос на список диких
  // разобраться с ним, обозвать onSearchWildUser даже если и просто получаем список всех
  onRefreshWildUserList(): void{
    this.isLoading = true;
    this.userService.search(this.wildUserSearchValues).subscribe(result => {
      this.wildUserList = result.content;
      this.totalWildUsersFounded = result.totalElements;
      this.isLoading = false;
    });
  }
  pagingWildUsers(pageEvent: PageEvent): void{
    if (this.wildUserSearchValues.pageSize !== pageEvent.pageSize){
      this.wildUserSearchValues.pageNumber = 0;
    } else {
      this.wildUserSearchValues.pageNumber = pageEvent.pageIndex;
    }
    this.wildUserSearchValues.pageSize = pageEvent.pageSize;
    // this.onSearchUser();
  }
}
