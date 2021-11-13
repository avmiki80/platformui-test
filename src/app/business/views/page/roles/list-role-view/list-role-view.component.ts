import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator, PageEvent} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatDialog} from '@angular/material/dialog';
import {DialogAction, DialogResult} from '../../../../data/object/DialogResult';
import {EditRoleDialogComponent} from '../../../dialog/edit-role-dialog/edit-role-dialog.component';
import {TranslateService} from '@ngx-translate/core';
import {DeviceDetectorService} from 'ngx-device-detector';
import {ConfirmDialogComponent} from '../../../dialog/confirm-dialog/confirm-dialog.component';
import {Role} from '../../../../../auth/model/Role';
import {PlatformApp} from '../../../../data/model/PlatformApp';
import {RoleSearch} from '../../../../data/search/RoleSearch';
import {DEFAULT_SORT_DIRECTION, DELAY_TIME, NAME} from '../../../../../app.constant';
import {Subject} from 'rxjs';
import {debounceTime} from 'rxjs/operators';
import {StaticMethods} from '../../../../../util/util';

@Component({
  selector: 'app-list-role-view',
  templateUrl: './list-role-view.component.html',
  styleUrls: ['./list-role-view.component.css']
})
export class ListRoleViewComponent implements OnInit {
  private searchSubject: Subject<any> = new Subject();
  readonly debTime: number = DELAY_TIME;
  readonly name: string = NAME;
  readonly viewName: string = 'viewName';
  readonly defaultSortDirection: string = DEFAULT_SORT_DIRECTION;
  sortDirectionName: string = null;
  sortDirectionViewName: string = null;
  isMobile: boolean;
  searchName: string;
  searchViewName: string;
  displayedColumns: string[];
  dataSource: MatTableDataSource<Role>;

  roleSearchValues: RoleSearch;
  @Input('roleSearchValues')
  set setRoleSearchValues(roleSearch: RoleSearch){
    this.roleSearchValues = roleSearch;
    this.searchName = this.roleSearchValues.name;
    this.searchViewName = this.roleSearchValues.viewName;
  }
  @Input()
  totalRolesFounded: number;
  @Input()
  onlyView: boolean;
  itemList: Role[];
  @Input('itemList')
  set setItemList(itemList: Role[]){
    this.itemList = itemList;
    // console.log(this.itemList);
    this.fillTable();
  }
  @Input()
  selectedRole: Role;
  @Output()
  selectRole = new EventEmitter<Role>();
  @Output()
  addRole = new EventEmitter<Role>();
  @Output()
  editRole = new EventEmitter<Role>();
  @Output()
  deleteRole = new EventEmitter<Role>();
  @Output()
  filter = new EventEmitter<RoleSearch>();
  @Output()
  pagingEvent = new EventEmitter<PageEvent>();

  // @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: false}) sort: MatSort;

  constructor(
    private dialog: MatDialog,
    private translateService: TranslateService,
    private deviceDetectorService: DeviceDetectorService
  ) {
    this.searchSubject.pipe(debounceTime(this.debTime)).subscribe(field => {
      this.roleSearchValues.name = this.searchName;
      this.roleSearchValues.viewName = this.searchViewName;
      this.roleSearchValues.pageNumber = 0;
      if (field) { this.roleSearchValues.sortColumn = field; }
      switch (field) {
        case this.name: {
          this.roleSearchValues.sortDirection = this.sortDirectionName = StaticMethods.selectSortDirection(this.sortDirectionName);
          this.sortDirectionViewName = null;
          break;
        }
        case this.viewName: {
          this.roleSearchValues.sortDirection = this.sortDirectionViewName = StaticMethods.selectSortDirection(this.sortDirectionViewName);
          this.sortDirectionName = null;
          break;
        }
        default: {
          this.roleSearchValues.sortDirection = this.defaultSortDirection;
          this.sortDirectionName = null;
          this.sortDirectionViewName = null;
          break;
        }
      }
      this.filter.emit(this.roleSearchValues);
    });
  }

  ngOnInit(): void {
    this.dataSource = new MatTableDataSource<Role>();
    if (!this.onlyView){
      this.displayedColumns = ['name', 'viewname', 'description', 'operation'];
    } else {
      this.displayedColumns = ['name', 'viewname'];
    }
    this.fillTable();
    this.selectedRole = null;
  }
  protected fillTable(): void{
    if (!this.dataSource){
      return;
    }
    if (!this.itemList){
      this.itemList = [];
    }
    this.selectedRole = null;
    this.dataSource.data = this.itemList;
    // this.addTableObjects();
    // когда получаем новые данные..
    // чтобы можно было сортировать по столбцам "категория" и "приоритет", т.к. там не примитивные типы, а объекты
    // @ts-ignore - показывает ошибку для типа даты, но так работает, т.к. можно возвращать любой тип
    // this.dataSource.sortingDataAccessor = (item, colName) => {
    //
    //   // по каким полям выполнять сортировку для каждого столбца
    //   switch (colName) {
    //     case 'name': {
    //       // @ts-ignore
    //       return item.name ? item.name : null;
    //     }
    //   }
    // };
  }

  // private addTableObjects(): void{
  //   this.dataSource.sort = this.sort;
  //   // this.dataSource.paginator = this.paginator;
  // }

  onClickSelectItem(item: Role): void{
    if (item && item !== this.selectedRole){
      this.selectedRole = item;
      this.selectRole.emit(this.selectedRole);
    }
  }
  onClickEditItem(item: Role): void{
    if (item){
      if (!item.description){
        item.description = '';
      }
      const dialogRef = this.dialog.open(EditRoleDialogComponent, {
        autoFocus: false,
        restoreFocus: false,
        width: '1000px',
        data: [item, this.translateService.instant('ROLE.EDITING')],
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result as DialogResult && result.obj && result.action === DialogAction.SAVE){
          this.editRole.emit(result.obj);
        }
      });
    }
  }
  onClickDeleteItem(item: Role): void{
    if (item){
      const dialogRef = this.dialog.open(ConfirmDialogComponent, {
        autoFocus: false,
        restoreFocus: false,
        width: '400px',
        data: {
          dialogTitle: this.translateService.instant('COMMON.CONFIRM'),
          message: this.translateService.instant('ROLE.CONFIRM-DELETE', {name: item.name})
        }
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result as DialogResult && result && result.action === DialogAction.OK){
          this.selectedRole = null;
          this.deleteRole.emit(item);
        }
      });
    }
  }
  onClickAddItem(): void{
    const platformRole = new Role(null, '', new PlatformApp(null, '', ''), '', '');
    const dialogRef = this.dialog.open(EditRoleDialogComponent, {
      autoFocus: false,
      restoreFocus: false,
      width: '1000px',
      data: [platformRole, this.translateService.instant('ROLE.ADDING')],
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result as DialogResult && result.obj && result.action === DialogAction.SAVE){
        this.addRole.emit(result.obj);
      }
    });
  }
  onFilter(field: string): void{
    this.searchSubject.next(field);
  }
  pageChanged(pageEvent: PageEvent): void{
    this.pagingEvent.emit(pageEvent);
  }
}
