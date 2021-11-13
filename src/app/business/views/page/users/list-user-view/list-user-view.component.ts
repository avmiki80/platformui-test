import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator, PageEvent} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatDialog} from '@angular/material/dialog';
import {EditUserDialogComponent} from '../../../dialog/edit-user-dialog/edit-user-dialog.component';
import {TranslateService} from '@ngx-translate/core';
import {DeviceDetectorService} from 'ngx-device-detector';
import {DialogAction, DialogResult} from '../../../../data/object/DialogResult';
import {ConfirmDialogComponent} from '../../../dialog/confirm-dialog/confirm-dialog.component';
import {User} from '../../../../../auth/model/User';
import {UnitService} from '../../../../data/dao/impl/unit.service';
import {UserSearch} from '../../../../data/search/UserSearch';
import {Unit} from '../../../../data/model/Unit';
import {Subject} from 'rxjs';
import {DEFAULT_SORT_DIRECTION, DELAY_TIME, NAME} from '../../../../../app.constant';
import {debounceTime} from "rxjs/operators";
import {StaticMethods} from "../../../../../util/util";

@Component({
  selector: 'app-list-user-view',
  templateUrl: './list-user-view.component.html',
  styleUrls: ['./list-user-view.component.css']
})
export class ListUserViewComponent implements OnInit {
  private searchSubject: Subject<any> = new Subject();
  readonly debTime: number = DELAY_TIME;
  readonly name: string = 'username';
  readonly email: string = 'email';
  readonly defaultSortDirection: string = DEFAULT_SORT_DIRECTION;
  sortDirectionName: string = null;
  sortDirectionEmail: string = null;
  displayedColumns: string[];
  searchName: string;
  dataSource: MatTableDataSource<User>;
  isMobile: boolean;
  itemList: User[];

  userSearchValues: UserSearch;
  @Input('userSearchValues')
  set setUserSearchvalues(userSearch: UserSearch){
    console.log(userSearch);
    this.userSearchValues = userSearch;
    this.searchName = this.userSearchValues.name;
  }
  @Input()
  totalUsersFounded: number;
  @Input('itemList')
  set setItemList(itemList: User[]) {
    this.itemList = itemList;
    this.fillTable();
  }
  @Input()
  unit: Unit;
  @Input()
  onlyView: boolean;
  @Input()
  wildUsersView: boolean;
  @Input()
  selectedUser: User;

  @Output()
  selectUser = new EventEmitter<User>();
  @Output()
  addUser = new EventEmitter<User>();
  @Output()
  editUser = new EventEmitter<User>();
  @Output()
  deleteUser = new EventEmitter<User>();
  @Output()
  refreshUsers = new EventEmitter();
  @Output()
  filter = new EventEmitter<UserSearch>();
  @Output()
  pagingEvent = new EventEmitter<PageEvent>();

  @ViewChild(MatSort, {static: false}) sort: MatSort;

  constructor(
    private dialog: MatDialog,
    private translateService: TranslateService,
    private deviceDetectorService: DeviceDetectorService,
    private unitService: UnitService,
  ) {
    this.searchSubject.pipe(debounceTime(this.debTime)).subscribe(field => {
      this.userSearchValues.username = this.searchName;
      this.userSearchValues.email = null;
      if (this.unit){
        this.userSearchValues.unitId = this.unit.id;
      } else {
        this.userSearchValues.unitId = null;
      }
      this.userSearchValues.pageNumber = 0;
      if (field) { this.userSearchValues.sortColumn = field; }
      switch (field) {
        case this.name: {
          this.userSearchValues.sortDirection = this.sortDirectionName = StaticMethods.selectSortDirection(this.sortDirectionName);
          this.sortDirectionEmail = null;
          break;
        }
        case this.email: {
          this.userSearchValues.sortDirection = this.sortDirectionEmail = StaticMethods.selectSortDirection(this.sortDirectionEmail);
          this.sortDirectionName = null;
          break;
        }
        default: {
          this.userSearchValues.sortDirection = this.defaultSortDirection;
          this.sortDirectionName = null;
          this.sortDirectionEmail = null;
          break;
        }
      }
      this.filter.emit(this.userSearchValues);
    });
  }

  ngOnInit(): void {
    this.isMobile = this.deviceDetectorService.isMobile();
    if (!this.onlyView){
      this.displayedColumns = ['username', 'email', 'operation'];
    } else{
      this.displayedColumns = ['username', 'email'];
    }
    this.dataSource = new MatTableDataSource<User>();
    this.selectedUser = null;
  }

  protected fillTable(): void {
    if (!this.dataSource) {
      return;
    }
    this.selectedUser = null;
    this.dataSource.data = this.itemList;
    // this.addTableObjects();
    // // когда получаем новые данные..
    // // чтобы можно было сортировать по столбцам "категория" и "приоритет", т.к. там не примитивные типы, а объекты
    // // @ts-ignore - показывает ошибку для типа даты, но так работает, т.к. можно возвращать любой тип
    // this.dataSource.sortingDataAccessor = (item, colName) => {
    //
    //   // по каким полям выполнять сортировку для каждого столбца
    //   switch (colName) {
    //     case 'username': {
    //       // @ts-ignore
    //       return item.username ? item.username : null;
    //     }
    //     case 'email': {
    //       // @ts-ignore
    //       return item.email ? item.email : null;
    //     }
    //   }
    // };
  }

  // private addTableObjects(): void {
  //   this.dataSource.sort = this.sort;
  //   // this.dataSource.paginator = this.paginator;
  // }

  onClickSelectItem(item: User): void {
    if (item) {
      this.selectedUser = item;
      this.selectUser.emit(this.selectedUser);
    }
  }

  onClickEditItem(item: User): void {
    if (item){
      this.unitService.getUnitByUserId(item.id).subscribe(unit => {
        item.unit = unit;
        const dialogRef = this.dialog.open(EditUserDialogComponent, {
          autoFocus: false,
          restoreFocus: false,
          width: '1400px',
          data: [item, this.translateService.instant('USER.EDITING')],
        });
        dialogRef.afterClosed().subscribe(result => {
          if (result as DialogResult && result.obj && result.action === DialogAction.SAVE){
            this.editUser.emit(result.obj);
          }
        });
      });
    }
  }

  onClickDeleteItem(item: User): void {
    if (item){
      const dialogRef = this.dialog.open(ConfirmDialogComponent, {
        autoFocus: false,
        restoreFocus: false,
        width: '400px',
        data: {
          dialogTitle: this.translateService.instant('COMMON.CONFIRM'),
          message: this.translateService.instant('USER.CONFIRM-DELETE', {name: item.username})
        }
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result as DialogResult && result && result.action === DialogAction.OK){
          this.selectedUser = null;
          this.deleteUser.emit(item);
        }
      });
    }
  }

  onClickAddItem(): void {
    const user = new User();
    user.username = '';
    user.email = '';
    user.firstName = '';
    user.patronymicName = '';
    user.lastName = '';
    const dialogRef = this.dialog.open(EditUserDialogComponent, {
      autoFocus: false,
      restoreFocus: false,
      width: '1400px',
      data: [user, this.translateService.instant('USER.ADDING')],
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result as DialogResult && result.obj && result.action === DialogAction.SAVE){
        this.addUser.emit(result.obj);
      }
    });
  }
  onClickRefreshItem(): void{
    this.refreshUsers.emit();
  }
  onFilter(field: string): void {
    this.searchSubject.next(field);
  }
  pageChanged(pageEvent: PageEvent): void{
    this.pagingEvent.emit(pageEvent);
  }
}
