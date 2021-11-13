import {Component, Input, OnInit} from '@angular/core';
import {RoleService} from '../../../../data/dao/impl/role.service';
import {DeviceDetectorService} from 'ngx-device-detector';
import {TranslateService} from '@ngx-translate/core';
import {Role} from '../../../../../auth/model/Role';
import {User} from '../../../../../auth/model/User';
import {RoleSearch} from '../../../../data/search/RoleSearch';
import {PageEvent} from '@angular/material/paginator';
import {DEFAULT_PAGE_NUMBER, DEFAULT_PAGE_SIZE} from '../../../../../app.constant';
import {MessageDialogComponent} from '../../../dialog/message-dialog/message-dialog.component';
import {MatDialog} from '@angular/material/dialog';

@Component({
  selector: 'app-role-view',
  templateUrl: './role-view.component.html',
  styleUrls: ['./role-view.component.css']
})
export class RoleViewComponent implements OnInit {

  isMobile: boolean;
  isLoading: boolean;
  selectRole: Role;
  userList: User[];
  readonly defaultPageSize = DEFAULT_PAGE_SIZE;
  readonly defaultPageNumber = DEFAULT_PAGE_NUMBER;
  roleSearchValues: RoleSearch;
  usersByRoleSearchValues: RoleSearch;
  totalRolesFounded: number;
  totalUsersFounded: number;

  user: User;
  @Input('user')
  set setUser(user: User){
    this.user = user;
    if (this.isShow){
      this.searchPlatformRole();
    }
  }

  isShow: boolean;
  @Input('show')
  set setShowView(isShow: boolean){
    this.isShow = isShow;
    if (this.user){
      this.searchPlatformRole();
    }
  }

  platformRoleSet: Role[];

  constructor(
    private deviceDetectorService: DeviceDetectorService,
    private roleService: RoleService,
    private translateService: TranslateService,
    private dialog: MatDialog
    ) { }

  ngOnInit(): void {
    this.isMobile = this.deviceDetectorService.isMobile();
    this.selectRole = null;
    this.initRoleSearch(null, null);
    this.initUserByRoleSearch(null, null, null);
  }

  initRoleSearch(name: string, viewName: string): void {
    if (!name) { name = ''; }
    if (!viewName) { viewName = ''; }
    this.roleSearchValues = new RoleSearch(name, viewName);
  }
  initUserByRoleSearch(name: string, viewName: string, role: Role): void {
    if (!name) { name = ''; }
    if (!viewName) { viewName = ''; }
    this.usersByRoleSearchValues = new RoleSearch(name, viewName, role);
    this.usersByRoleSearchValues.sortColumn = 'username';
  }

  searchPlatformRole(roleSearchValues?: RoleSearch): void {
    if (this.user) {
      this.isLoading = true;
      if (!this.roleSearchValues) {
        this.initRoleSearch(null, null);
      }
      if (roleSearchValues) {
        this.roleSearchValues = roleSearchValues;
      }
      this.roleService.search(this.roleSearchValues).subscribe(data => {
        this.platformRoleSet = data.content;
        this.totalRolesFounded = data.totalElements;

        let detectedRole = this.platformRoleSet[0];
        if (this.selectRole) {
          const detectedRoleTemp = this.platformRoleSet.find(value => value.id === this.selectRole.id);
          if (detectedRoleTemp) {
            this.selectRole = detectedRoleTemp;
            detectedRole = detectedRoleTemp;
          }
        }
        this.onSelectPlatformRole(detectedRole);
        this.isLoading = false;
      });
    }
  }
  onAddPlatformRole(platformRole: Role): void {
    if (platformRole) {
      this.isLoading = true;
      this.roleService.add(platformRole).subscribe(resultPlatformRole => {
        this.selectRole = resultPlatformRole;
        if (this.roleSearchValues.name && this.roleSearchValues.viewName) {
          if (!(platformRole.name.toUpperCase().includes(this.roleSearchValues.name.toUpperCase()) &&
                platformRole.viewName.toUpperCase().includes(this.roleSearchValues.viewName.toUpperCase()))) {
            this.initRoleSearch(null, null);
          }
        }
        else {
          if (this.roleSearchValues.name && !platformRole.name.toUpperCase().includes(this.roleSearchValues.name.toUpperCase())) {
            this.initRoleSearch(null, null);
          }
          if (this.roleSearchValues.viewName && !platformRole.viewName.toUpperCase().includes(this.roleSearchValues.viewName.toUpperCase())) {
            this.initRoleSearch(null, null);
          }
        }
        this.searchPlatformRole();
        this.isLoading = false;
      });
    }
  }
  onEditPlatformRole(platformRole: Role): void{
    if (platformRole){
      this.isLoading = true;
      this.selectRole = platformRole;
      this.roleService.update(platformRole).subscribe(result => {
        if (this.roleSearchValues.name && this.roleSearchValues.viewName) {
          if (!(platformRole.name.toUpperCase().includes(this.roleSearchValues.name.toUpperCase()) &&
            platformRole.viewName.toUpperCase().includes(this.roleSearchValues.viewName.toUpperCase()))) {
            this.initRoleSearch(null, null);
          }
        }
        else {
          if (this.roleSearchValues.name && !platformRole.name.toUpperCase().includes(this.roleSearchValues.name.toUpperCase())) {
            this.initRoleSearch(null, null);
          }
          if (this.roleSearchValues.viewName && !platformRole.viewName.toUpperCase().includes(this.roleSearchValues.viewName.toUpperCase())) {
            this.initRoleSearch(null, null);
          }
        }
        this.searchPlatformRole();
        this.isLoading = false;
      });
    }
  }
  onDeletePlatformRole(platformRole: Role): void{
    if (platformRole){
      this.isLoading = true;
      this.roleService.delete(platformRole.id).subscribe(result => {
        this.selectRole = null;
        if (this.platformRoleSet.length === 1) {
          if (this.roleSearchValues.pageNumber > 0) {
            this.roleSearchValues.pageNumber--;
          }
          else {
            this.initRoleSearch(null, null);
          }
        }
        this.searchPlatformRole();
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
                message: this.translateService.instant('ROLE.ERROR-DELETE')
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

  onSelectPlatformRole(platformRole: Role): void{
    if (platformRole){
      this.isLoading = true;
      this.selectRole = platformRole;
      this.roleService.findById(platformRole.id).subscribe(result => {
        this.usersByRoleSearchValues.pageSize = this.defaultPageSize;
        this.usersByRoleSearchValues.pageNumber = this.defaultPageNumber;
        this.onSearchUsersByRole();
        // this.usersByRoleSearchValues.role = this.selectRole;
        // this.roleService.findUsersByRole(this.usersByRoleSearchValues).subscribe(users => {
        //   this.userList = users.content;
        //   this.totalUsersFounded = users.totalElements;
        // });
        this.isLoading = false;
      });
    }
  }

  onSearchUsersByRole(): void{
    this.isLoading = true;
    this.usersByRoleSearchValues.role = this.selectRole;
    this.roleService.findUsersByRole(this.usersByRoleSearchValues).subscribe(users => {
      this.userList = users.content;
      this.totalUsersFounded = users.totalElements;
      this.isLoading = false;
    }, error => {
      this.isLoading = false;
    });
  }
  pagingRole(pageEvent: PageEvent): void{
    if (this.roleSearchValues.pageSize !== pageEvent.pageSize){
      this.roleSearchValues.pageNumber = 0;
    } else {
      this.roleSearchValues.pageNumber = pageEvent.pageIndex;
    }
    this.roleSearchValues.pageSize = pageEvent.pageSize;
    this.selectRole = null;
    this.searchPlatformRole();
  }
  pagingUser(pageEvent: PageEvent): void{
    if (this.usersByRoleSearchValues.pageSize !== pageEvent.pageSize){
      this.usersByRoleSearchValues.pageNumber = 0;
    } else {
      this.usersByRoleSearchValues.pageNumber = pageEvent.pageIndex;
    }
    this.usersByRoleSearchValues.pageSize = pageEvent.pageSize;
    this.onSearchUsersByRole();
  }

}
