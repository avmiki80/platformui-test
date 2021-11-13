import {Component, Inject, Input, OnInit} from '@angular/core';
import {PlatformApp} from '../../../data/model/PlatformApp';
import {PlatformAppService} from '../../../data/dao/impl/platform-app.service';
import {DeviceDetectorService} from 'ngx-device-detector';
import {TranslateService} from '@ngx-translate/core';
import {DialogAction, DialogResult} from '../../../data/object/DialogResult';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {BaseSearch} from '../../../data/search/BaseSearch';
import {DEFAULT_PAGE_NUMBER, DEFAULT_PAGE_SIZE} from '../../../../app.constant';
import {PageEvent} from '@angular/material/paginator';

@Component({
  selector: 'app-select-platform-app-dialog',
  templateUrl: './select-platform-app-dialog.component.html',
  styleUrls: ['./select-platform-app-dialog.component.css']
})
export class SelectPlatformAppDialogComponent implements OnInit {
  isMobile: boolean;
  isLoading: boolean;
  platformAppSet: PlatformApp[];
  selectPlatformApp: PlatformApp;
  dialogTitle: string;
  readonly defaultPageSize = DEFAULT_PAGE_SIZE;
  readonly defaultPageNumber = DEFAULT_PAGE_NUMBER;
  appSearchValues: BaseSearch;
  totalAppsFounded: number;

  constructor(
    private platformAppService: PlatformAppService,
    private deviceDetectorService: DeviceDetectorService,
    private translateService: TranslateService,
    private dialogRef: MatDialogRef<SelectPlatformAppDialogComponent>,
    @Inject(MAT_DIALOG_DATA) private data: [string],
  ) {
  }

  ngOnInit(): void {
    this.isMobile = this.deviceDetectorService.isMobile();
    this.dialogTitle = this.data[0];
    this.initSearch();
    this.searchPlatformApp();
  }

  private searchPlatformApp(): void {
    this.isLoading = true;
    this.platformAppService.search(this.appSearchValues).subscribe(data => {
      this.platformAppSet = data.content;
      this.totalAppsFounded = data.totalElements - 1;
      this.platformAppSet = this.platformAppSet.filter(app => app.name.toLocaleLowerCase() !== 'не задано');
      this.isLoading = false;
    });
  }

  onAddPlatformApp(platformApp: PlatformApp): void {
    if (platformApp) {
      this.isLoading = true;
      this.platformAppService.add(platformApp).subscribe(result => {
        this.appSearchValues.pageSize = this.defaultPageSize;
        this.appSearchValues.pageNumber = this.defaultPageNumber;
        this.searchPlatformApp();
        this.selectPlatformApp = result;
        this.isLoading = false;
      });
    }
  }

  onEditPlatformApp(platformApp: PlatformApp): void {
    if (platformApp) {
      this.isLoading = true;
      this.platformAppService.update(platformApp).subscribe(result => {
        this.appSearchValues.pageSize = this.defaultPageSize;
        this.appSearchValues.pageNumber = this.defaultPageNumber;
        this.searchPlatformApp();
        this.selectPlatformApp = result;
        this.isLoading = false;
      });
    }
  }

  onDeletePlatformApp(platformApp: PlatformApp): void {
    if (platformApp) {
      this.isLoading = true;
      this.platformAppService.delete(platformApp.id).subscribe(result => {
        this.appSearchValues.pageSize = this.defaultPageSize;
        this.appSearchValues.pageNumber = this.defaultPageNumber;
        this.searchPlatformApp();
        this.selectPlatformApp = null;
        this.isLoading = false;
      });
    }
  }

  onSelectPlatformApp(platformApp: PlatformApp): void {
    if (platformApp) {
      this.isLoading = true;
      this.platformAppService.findById(platformApp.id).subscribe(result => {
        this.selectPlatformApp = result;
        this.isLoading = false;
        this.dialogRef.close(new DialogResult(DialogAction.SELECT, this.selectPlatformApp));
      });
    }
  }
  onFilter(search: BaseSearch): void{
    this.appSearchValues = search;
    this.appSearchValues.pageNumber = this.defaultPageNumber;
    this.platformAppService.search(this.appSearchValues).subscribe(result => {
      this.platformAppSet = result.content;
      this.totalAppsFounded = result.totalElements;
      this.platformAppSet = this.platformAppSet.filter((app, index) => {
        if (app.name.toLocaleLowerCase() !== 'не задано'){
          return app;
        } else {
          this.totalAppsFounded--;
        }
      });
    });
  }
  onCancel(): void{
    this.dialogRef.close(new DialogResult(DialogAction.CANCEL));
  }
  private initSearch(): void{
    this.appSearchValues = new BaseSearch(null);
    this.appSearchValues.pageSize = this.defaultPageSize;
    this.appSearchValues.pageNumber = this.defaultPageNumber;
  }
  paging(pageEvent: PageEvent): void{
    if (this.appSearchValues.pageSize !== pageEvent.pageSize){
      this.appSearchValues.pageNumber = 0;
    } else {
      this.appSearchValues.pageNumber = pageEvent.pageIndex;
    }
    this.appSearchValues.pageSize = pageEvent.pageSize;
    this.searchPlatformApp();
  }
}
