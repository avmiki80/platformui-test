import {Component, Input, OnInit, Output, EventEmitter, ViewChild} from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {Unit} from '../../../data/model/Unit';
import {MatPaginator, PageEvent} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {TranslateService} from '@ngx-translate/core';
import {BaseSearch} from '../../../data/search/BaseSearch';

@Component({
  selector: 'app-list-item-view',
  templateUrl: './list-item-view.component.html',
  styleUrls: ['./list-item-view.component.css']
})
export class ListItemViewComponent implements OnInit {
  displayedColumns: string[] = ['title'];
  dataSource: MatTableDataSource<Unit>;
  unitList: Unit[];
  selectedUnit: Unit;
  @Input()
  totalItemsFounded: number;

  itemSearchValues: BaseSearch;
  @Input('itemSearchValues')
  set setItemSearchValues(itemSearchValues: BaseSearch){
    this.itemSearchValues = itemSearchValues;
  }
  searchText: string;
  @Input('unitList')
  set setUnit(unitList: Unit[]){
    this.unitList = unitList;
    this.fillTable();
  }
  @Output()
  selectUnit = new EventEmitter<Unit>();
  @Output()
  filterByName = new EventEmitter<BaseSearch>();
  @Output()
  pagingEvent = new EventEmitter<PageEvent>();


  // @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: false}) sort: MatSort;
  constructor(
    private translateService: TranslateService
  ) { }

  ngOnInit(): void {
    this.dataSource = new MatTableDataSource<Unit>();
    if (!this.unitList){
      this.unitList = [];
    }
    this.fillTable();
    this.selectedUnit = null;

  }
  private fillTable(): void{
    if (!this.dataSource){
      return;
    }
    this.dataSource.data = this.unitList;
    this.addTableObjects();
    // когда получаем новые данные..
    // чтобы можно было сортировать по столбцам "категория" и "приоритет", т.к. там не примитивные типы, а объекты
    // @ts-ignore - показывает ошибку для типа даты, но так работает, т.к. можно возвращать любой тип
    this.dataSource.sortingDataAccessor = (item, title) => {

      // по каким полям выполнять сортировку для каждого столбца
      switch (title) {
        case 'title': {
          // @ts-ignore
          return item.name ? item.name : null;
        }
      }
    };
  }

  private addTableObjects(): void{
    this.dataSource.sort = this.sort;
    // this.dataSource.paginator = this.paginator;
  }
  onClickSelectItem(unit: Unit): void{
    if (unit && unit !== this.selectedUnit){
      this.selectedUnit = unit;
      this.selectUnit.emit(this.selectedUnit);
    }
  }
  onFilter(): void{
    this.itemSearchValues.name = this.searchText;
    this.filterByName.emit(this.itemSearchValues);
  }
  pageChanged(pageEvent: PageEvent): void{
    this.pagingEvent.emit(pageEvent);
  }
}
