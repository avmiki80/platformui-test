import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {PlatformApp} from '../../../../data/model/PlatformApp';
import {MatSort} from '@angular/material/sort';
import {MatPaginator, PageEvent} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import {MatDialog} from '@angular/material/dialog';
import {ConfirmDialogComponent} from '../../../dialog/confirm-dialog/confirm-dialog.component';
import {DialogAction, DialogResult} from '../../../../data/object/DialogResult';
import {TranslateService, TranslationChangeEvent} from '@ngx-translate/core';
import {DeviceDetectorService} from 'ngx-device-detector';
import {EditPlatformAppDialogComponent} from '../../../dialog/edit-platform-app-dialog/edit-platform-app-dialog.component';
import {BaseSearch} from '../../../../data/search/BaseSearch';
import {Subject} from 'rxjs';
import {debounceTime} from 'rxjs/operators';
import {DEFAULT_SORT_DIRECTION, DELAY_TIME, NAME} from '../../../../../app.constant';
import {StaticMethods} from '../../../../../util/util';

@Component({
  selector: 'app-list-app-view',
  templateUrl: './list-app-view.component.html',
  styleUrls: ['./list-app-view.component.css']
})
export class ListAppViewComponent implements OnInit {
  private searchSubject: Subject<any> = new Subject();
  readonly debTime: number = DELAY_TIME;
  readonly name: string = NAME;
  readonly defaultSortDirection: string = DEFAULT_SORT_DIRECTION;
  sortDirectionName: string = null;
  isMobile: boolean;
  searchText: string;
  displayedColumns: string[] = ['name', 'url', 'description', 'operation'];
  translateWithoutDescription: string;
  dataSource: MatTableDataSource<PlatformApp>;

  appSearchValues: BaseSearch;
  @Input('appSearchValues')
  set setAppSearchValues(appSearch: BaseSearch){
    this.appSearchValues = appSearch;
    this.searchText = this.appSearchValues.name;
  }
  @Input()
  selectedPlatformApp: PlatformApp;

  @Input()
  totalAppsFounded: number;

  itemList: PlatformApp[];
  @Input('itemList')
  set setItemList(itemList: PlatformApp[]){
    this.itemList = itemList;
    this.fillTable();
  }

  @Output()
  selectPlatformApp = new EventEmitter<PlatformApp>();
  @Output()
  addPlatformApp = new EventEmitter<PlatformApp>();
  @Output()
  editPlatformApp = new EventEmitter<PlatformApp>();
  @Output()
  deletePlatformApp = new EventEmitter<PlatformApp>();
  @Output()
  filterByName = new EventEmitter<BaseSearch>();
  @Output()
  pagingEvent = new EventEmitter<PageEvent>();

  // @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: false}) sort: MatSort;

  constructor(
    private dialog: MatDialog,
    private translateService: TranslateService,
    private deviceDetectorService: DeviceDetectorService,
  ) {
    this.searchSubject.pipe(debounceTime(this.debTime)).subscribe(field => {
      this.appSearchValues.name = this.searchText;
      this.appSearchValues.pageNumber = 0;
      if (field) { this.appSearchValues.sortColumn = field; }
      switch (field) {
        case this.name: {
          this.appSearchValues.sortDirection = this.sortDirectionName = StaticMethods.selectSortDirection(this.sortDirectionName);
          break;
        }
        default: {
          this.appSearchValues.sortDirection = this.defaultSortDirection;
          this.sortDirectionName = null;
          break;
        }
      }
      this.filterByName.emit(this.appSearchValues);
    });
  }

  ngOnInit(): void {
    this.isMobile = this.deviceDetectorService.isMobile();
    this.dataSource = new MatTableDataSource<PlatformApp>();
    this.fillTable();
    this.initTranslations();
    this.translateService.onLangChange.subscribe((event: TranslationChangeEvent) => {
      this.initTranslations();
    });
  }
  initTranslations(): void{
    this.translateService.get(['COMMON.WITHOUT-DESCRIPTION']).subscribe((result: string) => {
      this.translateWithoutDescription = result['COMMON.WITHOUT-DESCRIPTION'];
    });
  }
  fillTable(): void{
    if (!this.dataSource){
      return;
    }
    if (!this.itemList){
      this.itemList = [];
    }
    this.dataSource.data = this.itemList;
  }
  onClickSelectItem(item: PlatformApp): void{
    if (item && item !== this.selectedPlatformApp) {
      this.selectedPlatformApp = item;
      this.selectPlatformApp.emit(this.selectedPlatformApp);
    }
  }
  onClickEditItem(item: PlatformApp): void{
    if (item){
      if (!item.description){
        item.description = '';
      }
      const dialogRef = this.dialog.open(EditPlatformAppDialogComponent, {
        autoFocus: false,
        restoreFocus: false,
        width: '800px',
        data: [item, this.translateService.instant('APP.EDITING')],
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result as DialogResult && result.obj && result.action === DialogAction.SAVE) {
          this.editPlatformApp.emit(result.obj);
        }
      });
    }
  }
  onClickDeleteItem(item: PlatformApp): void{
    if (item){
      const dialogRef = this.dialog.open(ConfirmDialogComponent, {
        autoFocus: false,
        restoreFocus: false,
        width: '400px',
        data: {
          dialogTitle: this.translateService.instant('COMMON.CONFIRM'),
          message: this.translateService.instant('APP.CONFIRM-DELETE', {name: item.name})
        }
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result as DialogResult && result && result.action === DialogAction.OK){
          this.selectedPlatformApp = null;
          this.deletePlatformApp.emit(item);
        }
      });
    }
  }
  onClickAddItem(): void{
    const platformApp = new PlatformApp(null, '', '', '');
    const dialogRef = this.dialog.open(EditPlatformAppDialogComponent, {
      autoFocus: false,
      restoreFocus: false,
      width: '800px',
      data: [platformApp, this.translateService.instant('APP.ADDING')],
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result as DialogResult && result.obj && result.action === DialogAction.SAVE) {
        this.addPlatformApp.emit(result.obj);
      }
    });
  }
  onFilter(field: string): void {
    this.searchSubject.next(field);
  }
  pageChanged(pageEvent: PageEvent): void{
    this.pagingEvent.emit(pageEvent);
  }
}
