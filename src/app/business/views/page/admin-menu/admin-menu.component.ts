import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {DeviceDetectorService} from 'ngx-device-detector';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-main-menu',
  templateUrl: './admin-menu.component.html',
  styleUrls: ['./admin-menu.component.css']
})
export class AdminMenuComponent implements OnInit {
  isMobile: boolean;
  menuItemList: string[];
  selectedItem: string;
  @Input('menuItemList')
  set setMenuItemList(menuItemList: string[]){
    this.menuItemList = menuItemList;
    if (this.menuItemList && this.menuItemList.length > 0){
      this.selectedItem = menuItemList[0];
    }
  }
  @Output()
  menuShow = new EventEmitter();
  @Output()
  showItemView = new EventEmitter<number>();

  constructor(
    private deviceDetectorService: DeviceDetectorService,
    private translateService: TranslateService,
  ) { }

  ngOnInit(): void {
    this.isMobile = this.deviceDetectorService.isMobile();
  }
  onShowLeftMenu(): void{
    this.menuShow.emit();
  }
  onSelectItem(item: string): void{
    if (item && item !== this.selectedItem){
      this.selectedItem = item;
      switch (this.selectedItem) {
        case this.menuItemList[0]: {
          this.showItemView.emit(0);
          break;
        }
        case this.menuItemList[1]: {
          this.showItemView.emit(1);
          break;
        }
        case this.menuItemList[2]: {
          this.showItemView.emit(2);
          break;
        }
        default: {
          this.showItemView.emit(0);
          break;
        }
      }
    }
  }
}
