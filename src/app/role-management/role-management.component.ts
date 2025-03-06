import { Component, effect, inject, OnDestroy, signal } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';

import { HasPermissionDirective } from '../shared/directives/has-permission.directive';
import { TableComponent } from '../shared/widgets/table/table.component';
import { PERMISSIONS } from '../shared/constants/permissions';
import { PermissionService } from '../shared/services/permission.service';
import { SettingsService } from '../shared/settings/settings.service';
import { SortOrder } from '../shared/widgets/table/sort-order.enum';
import { TableDataSource } from '../shared/widgets/table/table-data-source.model';
import { RoleDetails } from './interfaces/role-details.interface';
import { RoleManagementService } from './services/role-management.service';
import { ErrorHandlingService } from '../shared/error-handling/error-handling.service';
import { MessageService } from '../shared/messages/message.service';
import { AlertService } from '../shared/widgets/alert/alert.service';
import { ConfirmationService } from '../shared/widgets/confirmation-dialog/confirmation.service';
import { PaginatedRolesParams } from './interfaces/paginated-roles-params.interface';
import { AppManagementService } from '../app-management/services/app-management.service';
import { AppDetails } from '../app-management/app-details.interface';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
import { CommonModule } from '@angular/common';
import { FormatTitlePipe } from '../shared/pipes/format-title.pipe';

const PAGE_TITLE = 'Role Management';

const FIELDS = ['id', 'name', 'description', 'isActive'];

const COLUMNS = ['name', 'description', 'isActive'];

@Component({
  selector: 'app-role-management',
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    TableComponent,
    HasPermissionDirective,
    FormatTitlePipe,
  ],
  templateUrl: './role-management.component.html',
  styleUrl: './role-management.component.scss',
})
export class RoleManagementComponent implements OnDestroy {
  pageTitle = PAGE_TITLE;

  private settings = inject(SettingsService);

  permissionService = inject(PermissionService);
  permissions = PERMISSIONS.roles;

  readonly dialog = inject(MatDialog);

  loading = signal(false);

  selectedAppId: number = 1;
  appList: AppDetails[] = [];

  searchTerm = signal('');
  sortColumn = signal('');
  sortOrder = signal<SortOrder>(SortOrder.ascending);
  page = signal(1);
  pageSize = signal(
    this.settings.defaultSettings[this.settings.settingKeys.pageSize]
  );

  dataSource: TableDataSource<RoleDetails, PaginatedRolesParams>;
  fields = FIELDS;
  columns = COLUMNS;

  selected = signal<RoleDetails[]>([]);

  private destroy$: Subject<void> = new Subject<void>();

  constructor(
    private appManagementService: AppManagementService,
    private roleManagementService: RoleManagementService,
    private errorHandler: ErrorHandlingService,
    private confirmationService: ConfirmationService,
    private msgService: MessageService,
    private alertService: AlertService
  ) {
    this.settings.settings$
      .pipe(takeUntil(this.destroy$))
      .subscribe((settings) => {
        this.pageSize.set(settings[this.settings.settingKeys.pageSize]);
      });

    this.appManagementService
      .fetchDataSet({
        page: 1,
        pageSize: 100,
        searchTerm: '',
        sortColumn: 'id',
        sortOrder: SortOrder.ascending,
      })
      .subscribe((response) => {
        this.appList = response.items.filter((app) => app.isActive);
        this.selectedAppId = response.items[0].id;

        this.fetchTableData(this.selectedAppId);
      });

    this.dataSource = new TableDataSource<RoleDetails, PaginatedRolesParams>(
      this.roleManagementService,
      this.errorHandler
    );
  }

  private fetchTableData(appId: number) {
    this.dataSource.loadData({
      page: this.page(),
      pageSize: this.pageSize(),
      searchTerm: this.searchTerm(),
      sortColumn: this.sortColumn(),
      sortOrder: this.sortOrder(),
      appId: appId,
    });
  }

  onAppChange(event: MatSelectChange) {
    this.fetchTableData(event.value);
  }

  // refreshTable = effect(() => {
  //   this.fetchTableData();
  // });

  getSelection(roles: RoleDetails[]) {
    this.selected.set(roles);
  }

  view(id: string) {}

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
