import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';
import {TranslateService} from '@ngx-translate/core';
import {DialogAction, DialogResult} from '../../../data/object/DialogResult';
import {AbstractControl, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {User} from '../../../../auth/model/User';
import {Role} from '../../../../auth/model/Role';
import {SelectUnitDialogComponent} from '../select-unit-dialog/select-unit-dialog.component';

@Component({
  selector: 'app-edit-user-dialog',
  templateUrl: './edit-user-dialog.component.html',
  styleUrls: ['./edit-user-dialog.component.css']
})
export class EditUserDialogComponent implements OnInit {
  dialogTitle: string;
  user: User;
  confirmPassword: string;
  unitName: string;
  form: FormGroup;
  roleSet: Role[];

  constructor(
    private dialogRef: MatDialogRef<EditUserDialogComponent>,
    @Inject(MAT_DIALOG_DATA) private data: [User, string],
    private translateService: TranslateService,
    private formBuilder: FormBuilder,
    private dialog: MatDialog,
  ) { }

  ngOnInit(): void {
    this.dialogTitle = this.data[1];
    this.user = this.data[0];
    if (this.user){
      this.user.password = '';
      if (!this.user.roleSet){
        this.user.roleSet = [];
      }
      if (!this.user.unit){
        this.unitName = '';
      } else {
        this.unitName = this.user.unit.name;
      }
    }
    this.roleSet = this.user.roleSet;
    if (this.dialogTitle === this.translateService.instant('USER.ADDING')){
      this.form = this.formBuilder.group({
        username: [this.capitalize(this.user.username), Validators.required],
        email: [this.user.email, [Validators.required, Validators.email]],
        password: [this.user.password, [Validators.required]],
        confirmPassword: [this.user.password, [Validators.required]],
        lastName: [this.capitalize(this.user.lastName), [Validators.required]],
        firstName: [this.capitalize(this.user.firstName), [Validators.required]],
        patronymicName: [this.capitalize(this.user.patronymicName), [Validators.required]],
        unit: [this.unitName, [Validators.required]]
      });
    } else {
      this.form = this.formBuilder.group({
        username: [this.capitalize(this.user.username), Validators.required],
        email: [this.user.email, [Validators.required, Validators.email]],
        password: [this.user.password],
        confirmPassword: [this.user.password],
        lastName: [this.capitalize(this.user.lastName), [Validators.required]],
        firstName: [this.capitalize(this.user.firstName), [Validators.required]],
        patronymicName: [this.capitalize(this.user.patronymicName), [Validators.required]],
        unit: [this.unitName, [Validators.required]]
      });
    }
  }

  get getUsernameField(): AbstractControl{
    return this.form.get('username');
  }

  get getPasswordField(): AbstractControl{
    return this.form.get('password');
  }
  get getEmailField(): AbstractControl{
    return this.form.get('email');
  }
  get getConfirmPasswordField(): AbstractControl{
    return this.form.get('confirmPassword');
  }
  get getFirstNameField(): AbstractControl{
    return this.form.get('firstName');
  }
  get getLastNameField(): AbstractControl{
    return this.form.get('lastName');
  }
  get getPatronymicNameField(): AbstractControl{
    return this.form.get('patronymicName');
  }
  get getUnitField(): AbstractControl{
    return this.form.get('unit');
  }

  onConfirm(): void{
    if (this.form.invalid){
      return;
    }
    this.user.username = this.getUsernameField.value.toLowerCase();
    this.user.email = this.getEmailField.value.toLowerCase();
    this.user.firstName = this.getFirstNameField.value.toLowerCase();
    this.user.lastName = this.getLastNameField.value.toLowerCase();
    this.user.patronymicName = this.getPatronymicNameField.value.toLowerCase();
    this.user.roleSet = this.roleSet;
    if (this.getPasswordField.value && this.getPasswordField.value.trim().length > 0 &&
      this.getConfirmPasswordField.value && this.getConfirmPasswordField.value.trim().length > 0){
      this.user.password = this.getPasswordField.value;
    }
    this.dialogRef.close(new DialogResult(DialogAction.SAVE, this.user));
  }
  onCancel(): void{
    this.dialogRef.close(new DialogResult(DialogAction.CANCEL));
  }
  onClickAddRole(role: Role): void{
    if (this.roleSet.find(r => r.id === role.id)){
      return;
    }
    this.roleSet.push(role);
  }
  onClickDeleteRole(role: Role): void{
    if (role){
      this.roleSet = this.roleSet.filter(r => r.id !== role.id);
    }
  }
  onSetUnit(): void {
    const dlgRef = this.dialog.open(SelectUnitDialogComponent, {
      autoFocus: false,
      restoreFocus: false,
      width: '500px',
      data: [this.translateService.instant('UNIT.SELECT-UNIT')]
    });
    dlgRef.afterClosed().subscribe(result => {
      if (result && result as DialogResult && result.action === DialogAction.SELECT) {
        this.user.unit = result.obj;
        this.form.patchValue({unit: result.obj.name});
      }
    });
  }
  private capitalize(value: string): string {
    if (!value) {
      return value;
    }
    return value[0].toUpperCase() + value.substr(1).toLowerCase();
  }
}
