import {Component, Inject, OnInit} from '@angular/core';
import {AbstractControl, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AuthService} from '../../../../auth/service/auth.service';
import {TranslateService} from '@ngx-translate/core';
import {DeviceDetectorService} from 'ngx-device-detector';
import {User} from '../../../../auth/model/User';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {DialogAction, DialogResult} from '../../../data/object/DialogResult';
import {UserService} from "../../../data/dao/impl/user.service";

@Component({
  selector: 'app-change-password-dialog',
  templateUrl: './change-password-dialog.component.html',
  styleUrls: ['./change-password-dialog.component.css']
})
export class ChangePasswordDialogComponent implements OnInit {
  form: FormGroup;
  user: User;
  err: string;
  isLoading: boolean;
  dialogTitle: string;
  firstSubmitted = false;
  isMobile: boolean;

  constructor(
    private dialogRef: MatDialogRef<ChangePasswordDialogComponent>,
    @Inject(MAT_DIALOG_DATA) private data: [User, string],
    private formBuilder: FormBuilder,
    private userService: UserService,
    private translateService: TranslateService,
    private deviceDetectorService: DeviceDetectorService) { }

  ngOnInit(): void {
    this.dialogTitle = this.data[1];
    this.user = this.data[0];
    this.isMobile = this.deviceDetectorService.isMobile();
    this.form = this.formBuilder.group({
      password: ['', [Validators.required, Validators.minLength(4)]],
      confirmPassword: ['', [Validators.required, Validators.minLength(4)]],
    });
  }

  get passwordField(): AbstractControl{
    return this.form.get('password');
  }
  get confirmPasswordField(): AbstractControl{
    return this.form.get('confirmPassword');
  }
  submitForm(): void{
    this.firstSubmitted = true;
    if (this.form.invalid){
      return;
    }
    this.isLoading = true; // отображать индикатор загрузки
    this.user.password = this.passwordField.value;
    this.userService.update(this.user).subscribe(result => {
      this.user = result;
      this.isLoading = false;
      this.dialogRef.close(new DialogResult(DialogAction.COMPLETE));
    }, error => {
      this.isLoading = false;
      switch (error.error.exception) {
        default: {
          this.err = 'Ошибка: (обратитесь к администратору)';
          break;
        }
      }
    });
  }
  onCancel(): void{
    this.dialogRef.close(new DialogResult(DialogAction.CANCEL));
  }
}
