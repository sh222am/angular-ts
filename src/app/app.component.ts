import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { RadioButtonModule } from 'primeng/radiobutton';
import { NgFor, NgClass, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AgGridAngular } from 'ag-grid-angular'; // Angular Data Grid Component
import { ColDef, RowSelectionOptions, GridApi, SelectionChangedEvent } from 'ag-grid-community'; // Column Definition Type Interface

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,
    ButtonModule,
    RadioButtonModule,
    NgFor,
    FormsModule,
    NgClass,
    AgGridAngular,
    NgIf
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  private gridApi: GridApi | undefined;
  /**
   * 有効フラグ
   * true: Aを有効選択時→divA有効
   * false: Bを有効選択時→divB、ラジオボタン有効。ag-gridのチェックボックス表示
   */
  flag: boolean = true;
  // ラジオボタン選択状態
  selectedCategory: any = null;
  selectedCategoryTarget: any = null;
  // 合計値
  total: number = 0;

  // ラジオボタン項目（更新対象）
  categoriesTarget: any[] = [
    { name: 'アイテム1', key: 'TA' },
    { name: 'アイテム2', key: 'TB' },
  ];

  // ラジオボタン項目（チェンジイベントあり）
  categories: any[] = [
    { name: 'Aを有効', key: 'A' },
    { name: 'Bを有効', key: 'B' },
  ];

  // 初期表示
  ngOnInit() {
    console.log('[ngOnInit] execute');
    this.selectedCategory = this.categories[0];
    this.setCurrentClasses();
  }

  // divスタイル
  divACurrentClasses: Record<string, boolean> = {};
  divBCurrentClasses: Record<string, boolean> = {};

  // divスタイルセット
  setCurrentClasses() {
    this.divACurrentClasses = {
      // css class: 条件
      disabled: !this.flag,
    };

    this.divBCurrentClasses = {
      disabled: this.flag,
    };
  }

  // ラジオボタンイベント
  clickRadio() {
    this.flag = this.selectedCategory.key == 'A';
    this.setCurrentClasses();
    this.setRowSelection();
  }

  // Row Data: The data to be displayed.
  rowData = [
    { make: "Tesla", model: "Model Y", price: 64950, electric: true },
    { make: "Ford", model: "F-Series", price: 33850, electric: false },
    { make: "Toyota", model: "Corolla", price: 29600, electric: false },
  ];

  // Column Definitions: Defines the columns to be displayed.
  colDefs: ColDef[] = [
    { field: "make", filter: true },
    { field: "model" },
    { field: "price" },
    { field: "electric" }
  ];

  // ag-grid チェックボックス
  rowSelection: RowSelectionOptions = {
    mode: 'multiRow',
    headerCheckbox: true,
    checkboxes: !this.flag,
  };

  // ag-grid チェックボックス更新
  setRowSelection() {
    this.rowSelection = {
      mode: 'multiRow',
      headerCheckbox: true,
      checkboxes: !this.flag,
    }
  }

  // チェックボックスを無効化できない...?
  // // ag-grid 行クラスルール
  // rowClassRules = {
  //   'ag-row-selected': () => this.selectedCategory && this.selectedCategory.key != 'B',
  // };
  // // rowClass = 'ag-row-selected';
  // rowClass = '';

  // ag-grid 選択行データ取得
  getSelectedRowData() {
    let selectedData = [];
    if (this.gridApi) {
      selectedData = this.gridApi.getSelectedRows();
      console.log(`Selected Data:\n${JSON.stringify(selectedData)}`);
    }
    return selectedData;
  }

  // ag-grid 選択イベント
  onSelectionChanged(event: SelectionChangedEvent) {
    if (this.gridApi) {
      const selectedData = this.gridApi.getSelectedRows();
      console.log('Selection Changed', selectedData);
      this.total = Object.values(selectedData).reduce((acc, value) => acc + value.price, 0);
    }
  }

  onGridReady(params: { api: GridApi<any>; }) {
    this.gridApi = params.api;
  }

  clickBtnSum() {
    const selectedData = this.getSelectedRowData();
    this.total = Object.values(selectedData).reduce((acc, value) => acc + value.price, 0);
  }
}
