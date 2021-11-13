import {Component, Input, OnInit} from '@angular/core';
import {User} from '../../../../auth/model/User';
import {TranslateService} from '@ngx-translate/core';
import {MatDialog} from '@angular/material/dialog';
import {SettingsDialogComponent} from "../../dialog/settings-dialog/settings-dialog.component";
import {DialogAction} from "../../../data/object/DialogResult";
import {ChangePasswordDialogComponent} from "../../dialog/change-password-dialog/change-password-dialog.component";

@Component({
  selector: 'app-user-app',
  templateUrl: './user-card-view.component.html',
  styleUrls: ['./user-card-view.component.css']
})
export class UserCardViewComponent implements OnInit {
  user: User;
  @Input('user')
  set setUser(user: User){
    this.user = user;
  }

  constructor(
    private translateService: TranslateService,
    private dialog: MatDialog,
  ) { }

  ngOnInit(): void {
  }
  onChangePassword(): void{
    const dialogRef = this.dialog.open(ChangePasswordDialogComponent, {
      autoFocus: false,
      data: [this.user, this.translateService.instant('USER.CHANGE-PASSWORD')],
      width: '700px',
      minHeight: '300px',
      maxHeight: '90vh',
      restoreFocus: false
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result && result.action === DialogAction.SETTING_CHANGE){
        // вообще-то передавать в смарт компонент нечего. Но пока оствалю так. вдруг понадобиться
        // this.langChange.emit(result.obj);
        return;
      }
    });
  }
}
