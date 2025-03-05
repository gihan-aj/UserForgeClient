import {
  Component,
  computed,
  input,
  model,
  OnDestroy,
  OnInit,
  output,
  Signal,
} from '@angular/core';
import { Subscription } from 'rxjs';
import { SelectionModel } from '@angular/cdk/collections';

import { MatTableModule } from '@angular/material/table';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Sort, MatSortModule } from '@angular/material/sort';
import { MatMenuModule } from '@angular/material/menu';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';

import { TableDataSource } from './table-data-source.model';
import { FormatTitlePipe } from '../../pipes/format-title.pipe';
import { FormsModule } from '@angular/forms';
import { PAGE_SIZE_OPTIONS } from './page-size-options';
import { DEFAULT_COLUMNS } from './default-columns';
import { PaginationParams } from '../../interfaces/pagination-params.interface';

@Component({
  selector: 'app-table',
  imports: [
    CommonModule,
    MatTableModule,
    MatProgressBarModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    MatCheckboxModule,
    MatMenuModule,
    MatSortModule,
    MatProgressBarModule,
    MatFormFieldModule,
    MatInputModule,
    MatPaginatorModule,
    FormsModule,
    FormatTitlePipe,
  ],
  templateUrl: './table.component.html',
  styleUrl: './table.component.scss',
})
export class TableComponent<T extends HasId, U = PaginationParams>
  implements OnInit, OnDestroy
{
  dataSource = input.required<TableDataSource<T, U>>();
  fields = input.required<string[]>();
  columns = model.required<string[]>();

  searchTerm = model<string>('');
  sortOrder = model<string>('');
  sortBy = model<string>('');
  page = model.required<number>();
  pageSize = model.required<number>();
  pageSizeOptions = PAGE_SIZE_OPTIONS;

  actionsEnabled = input(true);
  canView = input<boolean>(false);
  onView = output<any>();
  canChangeStatus = input<boolean>(false);
  onActivate = output<any>();
  onDeactivate = output<any>();
  canEdit = input<boolean>(false);
  onEdit = output<any>();
  canDelete = input<boolean>(false);
  onDelete = output<any>();
  needActionMenu = computed<boolean>(
    () =>
      this.actionsEnabled() &&
      (this.canView() ||
        this.canEdit() ||
        this.canChangeStatus() ||
        this.canDelete())
  );

  multipleSelectEnabled = input(false);
  needMultipleSelect = computed<boolean>(
    () =>
      this.multipleSelectEnabled() &&
      (this.canChangeStatus() || this.canDelete())
  );

  defaultColumns = DEFAULT_COLUMNS;

  initialSelection: T[] = [];
  selection: Signal<SelectionModel<T>> = computed(
    () =>
      new SelectionModel<T>(this.multipleSelectEnabled(), this.initialSelection)
  );
  selectionChange = output<T[]>();

  constructor() {}

  dataSubscription: Subscription | undefined;
  selectionSubscription: Subscription | undefined;

  ngOnInit(): void {
    const updatedColumns = [...this.columns()];
    if (this.multipleSelectEnabled() && this.needMultipleSelect())
      updatedColumns.unshift(this.defaultColumns.select);
    if (this.actionsEnabled() && this.needActionMenu())
      updatedColumns.unshift(this.defaultColumns.actions);
    this.columns.set(updatedColumns);

    this.dataSubscription = this.dataSource().dataStream$.subscribe((data) => {
      this.selection().clear();
    });

    this.selectionSubscription = this.selection().changed.subscribe(() => {
      this.selectionChange.emit(this.selection().selected);
    });
  }

  ngOnDestroy(): void {
    if (this.dataSubscription) this.dataSubscription.unsubscribe();
    if (this.selectionSubscription) this.selectionSubscription.unsubscribe();
  }

  isAllSelected() {
    const numSelected = this.selection().selected.length;
    const numRows = this.dataSource().itemCount;

    return numSelected === numRows;
  }

  toggleAllRows() {
    if (this.isAllSelected()) {
      this.selection().clear();
      return;
    }
    this.selection().select(...this.dataSource().items);
  }

  checkboxLabel(row?: any) {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }

    return `${this.selection().isSelected(row) ? 'deselect' : 'select'} row ${
      row.id
    }`;
  }

  announceSortChange($event: Sort) {
    this.sortBy.set($event.active);
    this.sortOrder.set($event.direction);
  }

  onPaginatorChange($event: PageEvent) {
    this.page.set($event.pageIndex + 1);
    this.pageSize.set($event.pageSize);
  }

  delete(_t69: any[]) {
    this.onDelete.emit(_t69.map((e) => e.id));
  }
  deactivate(_t69: any[]) {
    this.onDeactivate.emit(_t69.map((e) => e.id));
  }
  activate(_t69: any[]) {
    this.onActivate.emit(_t69.map((e) => e.id));
  }
}

interface HasId {
  id: string | number;
}
