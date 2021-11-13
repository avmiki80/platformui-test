import {MatPaginatorIntl} from '@angular/material/paginator';
import {Injectable} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {LANG_RU} from '../../app.constant';

@Injectable()
export class MyMatPaginatorIntl extends MatPaginatorIntl{
  constructor(
    private translateService: TranslateService
  ) {
    super();
    this.translateService.use(LANG_RU);
    this.translateService.get('PAGING.PAGE-SIZE').subscribe(result => {
      super.itemsPerPageLabel = result;
    });
    this.translateService.get('PAGING.PREV').subscribe(result => {
      super.previousPageLabel = result;
    });
    this.translateService.get('PAGING.NEXT').subscribe(result => {
      super.nextPageLabel = result;
    });
    this.translateService.get('PAGING.LAST').subscribe(result => {
      super.lastPageLabel = result;
    });
    this.translateService.get('PAGING.FIRST').subscribe(result => {
      super.firstPageLabel = result;
    });
  }


  getRangeLabel = function(page, pageSize, length) {
    let res = '';
    if (length === 0 || pageSize === 0){
      // return '0 ' + this.translateService.instant('PAGING.OF') + ' ' + length;
      this.translateService.get('PAGING.OF').subscribe(result => {
        res = '0 ' + result + ' ' + length;
      });
      return res;
    }
    length = Math.max(length, 0);
    const startIndex = page * pageSize;
    const endIndex = startIndex < length ? Math.min(startIndex + pageSize, length) : startIndex + pageSize;
    // return startIndex + 1 + ' - ' + endIndex + ' ' + this.translateService.instant('PAGING.OF') + ' ' + length;
    this.translateService.get('PAGING.OF').subscribe(result => {
      res = startIndex + 1 + ' - ' + endIndex + ' ' + result + ' ' + length;
    });
    return res;
  };
}
