import {Component, Inject, OnInit} from '@angular/core';
import {Unit} from '../../../data/model/Unit';
import {DeviceDetectorService} from 'ngx-device-detector';
import {TranslateService} from '@ngx-translate/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {UnitService} from '../../../data/dao/impl/unit.service';
import {DialogAction, DialogResult} from '../../../data/object/DialogResult';
import {BaseSearch} from '../../../data/search/BaseSearch';
import {DEFAULT_PAGE_NUMBER, DEFAULT_PAGE_SIZE} from '../../../../app.constant';
import {PageEvent} from '@angular/material/paginator';


@Component({
  selector: 'app-select-unit-dialog',
  templateUrl: './select-unit-dialog.component.html',
  styleUrls: ['./select-unit-dialog.component.css']
})
export class SelectUnitDialogComponent implements OnInit {
  isMobile: boolean;
  isLoading: boolean;
  unitList: Unit[];
  selectUnit: Unit;
  dialogTitle: string;
  readonly defaultPageSize = DEFAULT_PAGE_SIZE;
  readonly defaultPageNumber = DEFAULT_PAGE_NUMBER;
  unitSearchValues: BaseSearch;
  totalUnitsFounded: number;

  constructor(
    private unitService: UnitService,
    private deviceDetectorService: DeviceDetectorService,
    private translateService: TranslateService,
    private dialogRef: MatDialogRef<SelectUnitDialogComponent>,
    @Inject(MAT_DIALOG_DATA) private data: [string],
  ) { }

  ngOnInit(): void {
    this.isMobile = this.deviceDetectorService.isMobile();
    this.dialogTitle = this.data[0];
    this.initSearch();
    this.searchUnit();
  }
  private searchUnit(): void {
    this.isLoading = true;
    this.unitService.search(this.unitSearchValues).subscribe(data => {
      this.unitList = data.content;
      this.totalUnitsFounded = data.totalElements;
      this.isLoading = false;
    });
  }
  onFilterUnit(search: BaseSearch): void{
    if (search){
      this.unitSearchValues = search;
      this.unitSearchValues.pageNumber = this.defaultPageNumber;
      this.unitService.search(this.unitSearchValues).subscribe(result => {
        this.unitList = result.content;
        this.totalUnitsFounded = result.totalElements;
      });
    }
  }
  onSelectUnit(unit: Unit): void {
    if (unit) {
      this.selectUnit = unit;
      this.dialogRef.close(new DialogResult(DialogAction.SELECT, this.selectUnit));
    }
  }
  onCancel(): void{
    this.dialogRef.close(new DialogResult(DialogAction.CANCEL));
  }
  private initSearch(): void{
    this.unitSearchValues = new BaseSearch(null);
    this.unitSearchValues.pageSize = this.defaultPageSize;
    this.unitSearchValues.pageNumber = this.defaultPageNumber;
  }
  paging(pageEvent: PageEvent): void{
    if (this.unitSearchValues.pageSize !== pageEvent.pageSize){
      this.unitSearchValues.pageNumber = 0;
    } else {
      this.unitSearchValues.pageNumber = pageEvent.pageIndex;
    }
    this.unitSearchValues.pageSize = pageEvent.pageSize;
    this.searchUnit();
  }
}
