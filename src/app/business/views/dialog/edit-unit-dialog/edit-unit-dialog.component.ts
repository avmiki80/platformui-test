import {Component, Inject, OnInit} from '@angular/core';
import {AbstractControl, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';
import {TranslateService} from '@ngx-translate/core';
import {DialogAction, DialogResult} from '../../../data/object/DialogResult';
import {Unit} from '../../../data/model/Unit';
import {SelectUnitDialogComponent} from '../select-unit-dialog/select-unit-dialog.component';
import {UnitService} from '../../../data/dao/impl/unit.service';

@Component({
  selector: 'app-edit-unit-dialog',
  templateUrl: './edit-unit-dialog.component.html',
  styleUrls: ['./edit-unit-dialog.component.css']
})
export class EditUnitDialogComponent implements OnInit {
  dialogTitle: string;
  unit: Unit;
  form: FormGroup;

  constructor(
    private dialogRef: MatDialogRef<EditUnitDialogComponent>,
    @Inject(MAT_DIALOG_DATA) private data: [Unit, string],
    private dialog: MatDialog,
    private translateService: TranslateService,
    private formBuilder: FormBuilder,
    private unitService: UnitService,
  ) {
  }

  ngOnInit(): void {
    this.dialogTitle = this.data[1];
    this.unit = this.data[0];
    if (this.unit.parentId !== 0) {
      this.unitService.findById(this.unit.parentId).subscribe(result => {
        this.form.patchValue({parent: result.name});
      });
    }
    this.form = this.formBuilder.group({
      name: [this.unit.name, Validators.required],
      parent: ['', Validators.required],
      description: [this.unit.description],
    });
  }

  get getNameField(): AbstractControl {
    return this.form.get('name');
  }

  get getParentField(): AbstractControl {
    return this.form.get('parent');
  }

  get getDescription(): AbstractControl {
    return this.form.get('description');
  }

  onConfirm(): void {
    if (this.form.invalid) {
      return;
    }
    this.unit.name = this.getNameField.value;
    this.unit.description = this.getDescription.value;
    this.dialogRef.close(new DialogResult(DialogAction.SAVE, this.unit));
  }

  onCancel(): void {
    this.dialogRef.close(new DialogResult(DialogAction.CANCEL));
  }

  onSetParentUnit(): void {
    const dlgRef = this.dialog.open(SelectUnitDialogComponent, {
      autoFocus: false,
      restoreFocus: false,
      width: '500px',
      data: [this.translateService.instant('UNIT.SELECT-UNIT')]
    });
    dlgRef.afterClosed().subscribe(result => {
      if (result && result as DialogResult && result.action === DialogAction.SELECT) {
        this.unit.parentId = result.obj.id;
        this.form.patchValue({parent: result.obj.name});
      }
    });
  }
}
