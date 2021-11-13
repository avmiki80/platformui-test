import { Component, OnInit } from '@angular/core';
import {DeviceDetectorService} from 'ngx-device-detector';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-access-denied',
  templateUrl: './access-denied.component.html',
  styleUrls: ['./access-denied.component.css']
})
export class AccessDeniedComponent implements OnInit {
  isMobile: boolean;
  constructor(
    private deviceDetectorService: DeviceDetectorService,
    private translateService: TranslateService
  ) { }

  ngOnInit(): void {
    this.isMobile = this.deviceDetectorService.isMobile();
  }
}
