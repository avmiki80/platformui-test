import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {PlatformApp} from '../../../data/model/PlatformApp';
import {TranslateService} from '@ngx-translate/core';
import {AbstractControl, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {DialogAction, DialogResult} from '../../../data/object/DialogResult';

@Component({
  selector: 'app-edit-platform-app-dialog',
  templateUrl: './edit-platform-app-dialog.component.html',
  styleUrls: ['./edit-platform-app-dialog.component.css']
})
export class EditPlatformAppDialogComponent implements OnInit {
  dialogTitle: string;
  platFormApp: PlatformApp;
  form: FormGroup;
  constructor(
    private dialogRef: MatDialogRef<EditPlatformAppDialogComponent>,
    @Inject(MAT_DIALOG_DATA) private data: [PlatformApp, string],
    private translateService: TranslateService,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    this.dialogTitle = this.data[1];
    this.platFormApp = this.data[0];
    this.form = this.formBuilder.group({
      appName: [this.platFormApp.name, Validators.required],
      appURL: [this.platFormApp.appURL, [Validators.required]],
      appDescription: [this.platFormApp.description],
    });
  }
  get getAppNameField(): AbstractControl{
    return this.form.get('appName');
  }

  get getAppURLField(): AbstractControl{
    return this.form.get('appURL');
  }
  get getAppDescription(): AbstractControl{
    return this.form.get('appDescription');
  }
  onConfirm(): void{
    if (this.form.invalid){
      return;
    }
    this.platFormApp.name = this.getAppNameField.value;
    this.platFormApp.appURL = this.getAppURLField.value;
    this.platFormApp.description = this.getAppDescription.value;
    this.dialogRef.close(new DialogResult(DialogAction.SAVE, this.platFormApp));
  }
  onCancel(): void{
    this.dialogRef.close(new DialogResult(DialogAction.CANCEL));
  }
}
