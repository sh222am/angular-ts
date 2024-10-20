import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { RadioButtonModule } from 'primeng/radiobutton';
import { NgFor, NgClass } from '@angular/common';
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
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  private gridApi: GridApi | undefined;
  ingredient!: string;
  // ラジオボタン選択状態
  selectedCategory: any = null;

  flag: boolean = true;
  // 合計値
  total: number = 0;

  categories: any[] = [
    { name: 'Aを有効', key: 'A' },
    { name: 'Bを有効', key: 'B' },
  ];

  ngOnInit() {
    console.log('[ngOnInit] execute');
    this.selectedCategory = this.categories[1];
    this.setCurrentClasses();
  }

  // divの活性化切り替え
  divACurrentClasses: Record<string, boolean> = {};
  divBCurrentClasses: Record<string, boolean> = {};

  setCurrentClasses() {
    this.divACurrentClasses = {
      disabled: this.selectedCategory.key != 'A',
    };

    this.divBCurrentClasses = {
      disabled: this.selectedCategory.key != 'B',
    };
  }

  // これなくてよいのでは...?→やっぱり必要
  clickRadio() {
    // this.flag = this.selectedCategory.key == 'A';
    this.setCurrentClasses();
    this.setRowSelection();
  }

  clickBtn() {
    this.setCurrentClasses();
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

  rowSelection: RowSelectionOptions = {
    mode: 'multiRow',
    headerCheckbox: true,
    checkboxes: this.selectedCategory && this.selectedCategory.key != 'B',
    // enableClickSelection: false,
    // enableSelectionWithoutKeys: false,
    // hideDisabledCheckboxes: true,
  };

  setRowSelection() {
    this.rowSelection = {
      mode: 'multiRow',
      headerCheckbox: true,
      checkboxes: this.selectedCategory && this.selectedCategory.key != 'B',
    }
  }

  rowClassRules = {
    // apply red to Ford cars
    // 'rag-red': (params: { data: { make: string; }; }) => params.data.make === 'Ford',
    'ag-row-selected': () => this.selectedCategory && this.selectedCategory.key != 'B',
  };

  // rowClass = 'ag-row-selected';
  rowClass = '';

  getSelectedRowData() {
    let selectedData = [];
    if (this.gridApi) {
      selectedData = this.gridApi.getSelectedRows();
      // alert(`Selected Data:\n${JSON.stringify(selectedData)}`);
    }
    return selectedData;
  }

  onSelectionChanged(event: SelectionChangedEvent) {
    if (this.gridApi) {
      const selectedData = this.gridApi.getSelectedRows();
      console.log('Selection Changed', selectedData);
    }
  }

  onGridReady(params: { api: GridApi<any>; }) {
    this.gridApi = params.api;

    // this.http
    //   .get<any[]>(
    //     'https://raw.githubusercontent.com/ag-grid/ag-grid/master/grid-packages/ag-grid-docs/src/olympicWinnersSmall.json'
    //   )
    //   .subscribe((data) => {
    //     this.rowData = data;
    //   });
  }

  clickBtnSum() {
    const selectedData = this.getSelectedRowData();
    this.total = Object.values(selectedData).reduce((acc, value) => acc + value.price, 0);
  }
}
