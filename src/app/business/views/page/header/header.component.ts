import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {DeviceDetectorService} from 'ngx-device-detector';
import {TranslateService} from '@ngx-translate/core';
import {User} from '../../../../auth/model/User';
import {AuthService} from '../../../../auth/service/auth.service';
import {MatDialog} from '@angular/material/dialog';
import {SettingsDialogComponent} from '../../dialog/settings-dialog/settings-dialog.component';
import {DialogAction} from '../../../data/object/DialogResult';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  isMobile: boolean;
  @Output()
  toggleMenu = new EventEmitter();
  @Output()
  langChange = new EventEmitter<string>();
  @Input()
  user: User;
  constructor(
    private deviceDetectorService: DeviceDetectorService,
    private translateService: TranslateService,
    private authService: AuthService,
    private dialog: MatDialog,
    ) { }

  ngOnInit(): void {
    this.isMobile = this.deviceDetectorService.isMobile();
  }
  logout(): void{
    this.authService.logout();
  }
  onToggleMenu(): void{
    this.toggleMenu.emit();
  }
  showSettings(): void{
    const dialogRef = this.dialog.open(SettingsDialogComponent, {
      autoFocus: false,
      width: '700px',
      minHeight: '300px',
      maxHeight: '90vh',
      restoreFocus: false
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result && result.action === DialogAction.SETTING_CHANGE){
        // вообще-то передавать в смарт компонент нечего. Но пока оствалю так. вдруг понадобиться
        this.langChange.emit(result.obj);
        return;
      }
    });
  }
}
