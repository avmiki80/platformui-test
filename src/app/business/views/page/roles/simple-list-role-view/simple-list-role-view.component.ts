import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {TranslateService} from '@ngx-translate/core';
import {SelectRoleDialogComponent} from '../../../dialog/select-role-dialog/select-role-dialog.component';
import {DialogAction, DialogResult} from '../../../../data/object/DialogResult';
import {Role} from '../../../../../auth/model/Role';

@Component({
  selector: 'app-simple-list-role-view',
  templateUrl: './simple-list-role-view.component.html',
  styleUrls: ['./simple-list-role-view.component.css']
})
export class SimpleListRoleViewComponent implements OnInit {
  roleSet: Role[];
  @Input('roleSet')
  set setRoleSet(roleSet: Role[]){
    this.roleSet = roleSet;
  }
  @Input()
  onlyView: boolean;

  @Output()
  addRole = new EventEmitter<Role>();

  @Output()
  deleteRole = new EventEmitter<Role>();

  constructor(
    private dialog: MatDialog,
    private translateService: TranslateService
  ) { }

  ngOnInit(): void {
    if (!this.roleSet){
      this.roleSet = [];
    }
  }
  onClickAddRole(): void{
    const dialogRef = this.dialog.open(SelectRoleDialogComponent, {
      autoFocus: false,
      restoreFocus: false,
      data: [this.translateService.instant('APP.ADDING')],
      width: '800px'
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result && result as DialogResult && result.action === DialogAction.SELECT){
        this.addRole.emit(result.obj);
      }
    });
  }
  onClickDeleteRole(role: Role): void{
    if (role){
      this.deleteRole.emit(role);
    }
  }
}
