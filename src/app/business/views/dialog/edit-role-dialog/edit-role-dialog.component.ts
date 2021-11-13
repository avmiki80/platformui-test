import {Component, Inject, OnInit} from '@angular/core';
import {AbstractControl, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';
import {TranslateService} from '@ngx-translate/core';
import {DialogAction, DialogResult} from '../../../data/object/DialogResult';
import {SelectPlatformAppDialogComponent} from '../select-platform-app-dialog/select-platform-app-dialog.component';
import {Role} from '../../../../auth/model/Role';

@Component({
  selector: 'app-edit-role-dialog',
  templateUrl: './edit-role-dialog.component.html',
  styleUrls: ['./edit-role-dialog.component.css']
})
export class EditRoleDialogComponent implements OnInit {
  dialogTitle: string;
  platFormRole: Role;
  form: FormGroup;
  constructor(
    private dialogRef: MatDialogRef<EditRoleDialogComponent>,
    private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) private data: [Role, string],
    private translateService: TranslateService,
    private formBuilder: FormBuilder
  ) {
  }

  ngOnInit(): void {
    this.dialogTitle = this.data[1];
    this.platFormRole = this.data[0];
    this.form = this.formBuilder.group({
      roleName: [this.platFormRole.name, Validators.required],
      platformApp: [this.platFormRole.application.name, [Validators.required]],
      roleViewName:  [this.platFormRole.viewName, Validators.required],
      roleDescription: [this.platFormRole.description],
    });
  }
  get getPlatformAppField(): AbstractControl{
    return this.form.get('platformApp');
  }

  get getRoleNameField(): AbstractControl{
    return this.form.get('roleName');
  }
  get getRoleViewNameField(): AbstractControl{
    return this.form.get('roleViewName');
  }
  get getRoleDescriptionField(): AbstractControl{
    return this.form.get('roleDescription');
  }
  onConfirm(): void{
    if (this.form.invalid){
      return;
    }
    this.platFormRole.name = this.getRoleNameField.value;
    this.platFormRole.viewName = this.getRoleViewNameField.value;
    this.platFormRole.description = this.getRoleDescriptionField.value;
    this.dialogRef.close(new DialogResult(DialogAction.SAVE, this.platFormRole));
  }
  onCancel(): void{
    this.dialogRef.close(new DialogResult(DialogAction.CANCEL));
  }
  onSetApp(): void{
    const dialogRef = this.dialog.open(SelectPlatformAppDialogComponent, {
      autoFocus: false,
      restoreFocus: false,
      data: [this.translateService.instant('APP.ADDING')],
      width: '900px'
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result && result as DialogResult && result.action === DialogAction.SELECT){
       this.platFormRole.application = result.obj;
       this.form.patchValue({platformApp: this.platFormRole.application.name});
      }
    });
  }
}
