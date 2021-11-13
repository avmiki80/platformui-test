import {Component, OnInit, Output, EventEmitter, Input} from '@angular/core';
import {FlatTreeControl} from '@angular/cdk/tree';
import {MatTreeFlatDataSource, MatTreeFlattener} from '@angular/material/tree';
import {MatDialog} from '@angular/material/dialog';
import {EditUnitDialogComponent} from '../../../dialog/edit-unit-dialog/edit-unit-dialog.component';
import {Unit} from '../../../../data/model/Unit';
import {TranslateService} from '@ngx-translate/core';
import {DialogAction, DialogResult} from '../../../../data/object/DialogResult';
import {UnitNode} from '../../../../data/model/UnitNode';
import {UserSearch} from '../../../../data/search/UserSearch';
import {ConfirmDialogComponent} from '../../../dialog/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-tree-unit-view',
  templateUrl: './tree-unit-view.component.html',
  styleUrls: ['./tree-unit-view.component.css']
})
export class TreeUnitViewComponent implements OnInit{
  selectedNode: FlatNode;
  selectedUnit: Unit;
  unitList: Unit[];
  @Input('unitList')
  set setUnitList(unitList: Unit[]) {
    this.unitList = unitList;
  }
  unitTree: UnitNode;
  @Input('unitTree')
  set setUnitTree(unitTree: UnitNode){
    this.unitTree = unitTree;
    this.dataSource.data = this.unitTree.children;
  }
  @Output()
  addUnit = new EventEmitter<Unit>();
  @Output()
  editUnit = new EventEmitter<Unit>();
  @Output()
  deleteUnit = new EventEmitter<Unit>();
  @Output()
  selectUnit = new EventEmitter<Unit>();
  // @Output()
  // filter = new EventEmitter<UserSearch>();

  private transformer = (node: UnitNode, level: number) => {
    return {
      expandable: !!node.children && node.children.length > 0,
      unit: node.data,
      level: level,
    };
  }

  treeControl = new FlatTreeControl<FlatNode>(
    node => node.level, node => node.expandable);

  treeFlattener = new MatTreeFlattener(
    this.transformer, node => node.level, node => node.expandable, node => node.children);

  dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);

  constructor(
    private dialog: MatDialog,
    private translateService: TranslateService
  ) {
  }

  ngOnInit(): void {
    if (this.unitTree){
      this.dataSource.data = this.unitTree.children;
    }
  }

  hasChild = (_: number, node: FlatNode) => node.expandable;

  onClickAddUnit(): void{
    const unit = new Unit(null, '', 0, '');
    const dialogRef = this.dialog.open(EditUnitDialogComponent, {
      width: '1000px',
      autoFocus: false,
      restoreFocus: false,
      data: [unit, this.translateService.instant('COMMON.ADDING')]
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result as DialogResult && result.obj && result.action === DialogAction.SAVE){
        this.selectedUnit = result.obj;
        this.addUnit.emit(this.selectedUnit);
      }
    });
  }
  onClickEditUnit(node: FlatNode): void{
    if (node){
      this.selectedNode = node;
      this.selectedUnit = node.unit;
      const dialogRef = this.dialog.open(EditUnitDialogComponent, {
        width: '1000px',
        autoFocus: false,
        restoreFocus: false,
        data: [this.selectedUnit, this.translateService.instant('COMMON.EDITING')]
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result as DialogResult && result.obj && result.action === DialogAction.SAVE){
          this.selectedUnit = result.obj;
          this.editUnit.emit(this.selectedUnit);
        }
      });
    }
  }
  onClickDeleteUnit(node: FlatNode): void{
    if (node && node.unit){
        const dialogRef = this.dialog.open(ConfirmDialogComponent, {
          autoFocus: false,
          restoreFocus: false,
          width: '400px',
          data: {
            dialogTitle: this.translateService.instant('COMMON.CONFIRM'),
            message: this.translateService.instant('UNIT.CONFIRM-DELETE', {name: node.unit.name})
          }
        });
        dialogRef.afterClosed().subscribe(result => {
          if (result as DialogResult && result && result.action === DialogAction.OK){
            this.selectedUnit = null;
            this.selectedNode = null;
            this.deleteUnit.emit(node.unit);
          }
        });
    }
  }

  onClickUnit(node: FlatNode): void{
    if (node){
      this.selectedNode = node;
      this.selectedUnit = node.unit;
      this.selectUnit.emit(this.selectedUnit);
      // this.filter.emit(new UserSearch(null, null, this.selectedUnit.id));
    }
  }
}

interface FlatNode {
  expandable: boolean;
  unit: Unit;
  level: number;
}
