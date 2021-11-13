import {Component, Inject, OnInit} from '@angular/core';
import {DeviceDetectorService} from 'ngx-device-detector';
import {TranslateService} from '@ngx-translate/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {RoleService} from '../../../data/dao/impl/role.service';
import {DialogAction, DialogResult} from '../../../data/object/DialogResult';
import {Role} from '../../../../auth/model/Role';
import {DEFAULT_PAGE_NUMBER, DEFAULT_PAGE_SIZE} from '../../../../app.constant';
import {RoleSearch} from '../../../data/search/RoleSearch';
import {PageEvent} from '@angular/material/paginator';

@Component({
  selector: 'app-select-role-dialog',
  templateUrl: './select-role-dialog.component.html',
  styleUrls: ['./select-role-dialog.component.css']
})
export class SelectRoleDialogComponent implements OnInit {
  isMobile: boolean;
  isLoading: boolean;
  roleSet: Role[];
  selectRole: Role;
  dialogTitle: string;
  readonly defaultPageSize = DEFAULT_PAGE_SIZE;
  readonly defaultPageNumber = DEFAULT_PAGE_NUMBER;
  roleSearchValues: RoleSearch;
  totalRolesFounded: number;

  constructor(
    private roleService: RoleService,
    private deviceDetectorService: DeviceDetectorService,
    private translateService: TranslateService,
    private dialogRef: MatDialogRef<SelectRoleDialogComponent>,
    @Inject(MAT_DIALOG_DATA) private data: [string],
  ) { }

  ngOnInit(): void {
    this.isMobile = this.deviceDetectorService.isMobile();
    this.dialogTitle = this.data[0];
    this.initSearch();
    this.searchRole();
  }

  private searchRole(): void {
    this.isLoading = true;
    this.roleService.search(this.roleSearchValues).subscribe(data => {
      this.roleSet = data.content;
      this.totalRolesFounded = data.totalElements;
      this.isLoading = false;
    });
  }

  onAddRole(role: Role): void {
    if (role) {
      this.isLoading = true;
      this.roleService.add(role).subscribe(result => {
        this.searchRole();
        this.selectRole = result;
        this.isLoading = false;
      });
    }
  }

  onEditRole(role: Role): void {
    if (role) {
      this.isLoading = true;
      this.roleService.update(role).subscribe(result => {
        this.searchRole();
        this.selectRole = result;
        this.isLoading = false;
      });
    }
  }

  onDeleteRole(role: Role): void {
    if (role) {
      this.isLoading = true;
      this.roleService.delete(role.id).subscribe(result => {
        this.searchRole();
        this.selectRole = null;
        this.isLoading = false;
      });
    }
  }

  onSelectRole(role: Role): void {
    if (role) {
      this.isLoading = true;
      this.roleService.findById(role.id).subscribe(result => {
        this.selectRole = result;
        this.isLoading = false;
        this.dialogRef.close(new DialogResult(DialogAction.SELECT, this.selectRole));
      });
    }
  }
  onCancel(): void{
    this.dialogRef.close(new DialogResult(DialogAction.CANCEL));
  }
  private initSearch(): void{
    this.roleSearchValues = new RoleSearch(null, null);
    this.roleSearchValues.pageSize = this.defaultPageSize;
    this.roleSearchValues.pageNumber = this.defaultPageNumber;
  }
  paging(pageEvent: PageEvent): void{
    if (this.roleSearchValues.pageSize !== pageEvent.pageSize){
      this.roleSearchValues.pageNumber = 0;
    } else {
      this.roleSearchValues.pageNumber = pageEvent.pageIndex;
    }
    this.roleSearchValues.pageSize = pageEvent.pageSize;
    this.searchRole();
  }
}
