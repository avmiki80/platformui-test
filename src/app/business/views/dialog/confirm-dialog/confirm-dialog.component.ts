import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {DialogAction, DialogResult} from 'src/app/business/data/object/DialogResult';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.css']
})
export class ConfirmDialogComponent implements OnInit {

  dialogTitle: string;
  message: string;

  constructor(
    private dialogRef: MatDialogRef<ConfirmDialogComponent>,
    private translateService: TranslateService,
    @Inject(MAT_DIALOG_DATA) private data: {dialogTitle: string, message: string}
  ) { }

  ngOnInit(): void {
    this.dialogTitle = this.data.dialogTitle;
    this.message = this.data.message;
  }

  onConfirm(): void{
    this.dialogRef.close(new DialogResult(DialogAction.OK));
  }
  onCancel(): void{
    this.dialogRef.close(new DialogResult(DialogAction.CANCEL));
  }
}
