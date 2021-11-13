import { Component, OnInit } from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {MatDialogRef} from '@angular/material/dialog';
import {DialogAction, DialogResult} from '../../../data/object/DialogResult';
import {LANG_EN, LANG_RU} from '../../../../app.constant';



@Component({
  selector: 'app-settings-dialog',
  templateUrl: './settings-dialog.component.html',
  styleUrls: ['./settings-dialog.component.css']
})
export class SettingsDialogComponent implements OnInit {
  settingsChanged = false; // были ли изменены настройки
  lang: string; // хранит выбранный язык в настройках

  // просто ссылаются на готовые константы
  en = LANG_EN;
  ru = LANG_RU;
  constructor(
    private translateService: TranslateService, // для локализации
    private dialogRef: MatDialogRef<SettingsDialogComponent>, // для возможности работы с текущим диалог. окном
  ) { }

  ngOnInit(): void {
    this.lang = this.translateService.currentLang;
  }
  // переключение языка
  langChanged(): void {
    this.translateService.use(this.lang); // сразу устанавливаем язык для приложения
    this.settingsChanged = true; // указываем, что настройки были изменены
  }
  // нажали Закрыть
  close(): void {

    if (this.settingsChanged) { // если в настройках произошли изменения
      this.dialogRef.close(new DialogResult(DialogAction.SETTING_CHANGE, this.lang));
    } else {
      this.dialogRef.close(new DialogResult(DialogAction.CANCEL));
    }
  }
}
