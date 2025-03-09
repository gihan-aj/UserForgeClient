import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy, signal } from '@angular/core';
import { map, of, Subject, switchMap, takeUntil } from 'rxjs';

import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
import { MatDialog } from '@angular/material/dialog';

import { HasPermissionDirective } from '../../../shared/directives/has-permission.directive';
import { FormatTitlePipe } from '../../../shared/pipes/format-title.pipe';
import { TableComponent } from '../../../shared/widgets/table/table.component';
import { AppDetails } from '../../../app-management/app-details.interface';
import { PERMISSIONS } from '../../../shared/constants/permissions';
import { PermissionService } from '../../../shared/services/permission.service';
import { SettingsService } from '../../../shared/settings/settings.service';
import { SortOrder } from '../../../shared/widgets/table/sort-order.enum';
import { TableDataSource } from '../../../shared/widgets/table/table-data-source.model';
import { PaginatedRolesParams } from '../../interfaces/paginated-roles-params.interface';
import { RoleDetails } from '../../interfaces/role-details.interface';
import { AppManagementService } from '../../../app-management/services/app-management.service';
import { ErrorHandlingService } from '../../../shared/error-handling/error-handling.service';
import { RoleManagementService } from '../../services/role-management.service';
import { RoleDetailsDialogType } from '../role-details-dialog/role-details-dialog.type';
import { RoleDetailsDialogData } from '../role-details-dialog/role-details-dilaog-data.interface';
import { RoleDetailsDialogComponent } from '../role-details-dialog/role-details-dialog.component';
import { AlertService } from '../../../shared/widgets/alert/alert.service';
import { Router } from '@angular/router';

const PAGE_TITLE = 'Role Management';

const FIELDS = ['id', 'name', 'description', 'isActive'];

const COLUMNS = ['name', 'description', 'isActive'];

@Component({
  selector: 'app-roles-table',
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
  templateUrl: './roles-table.component.html',
  styleUrl: './roles-table.component.scss',
})
export class RolesTableComponent implements OnDestroy {
  pageTitle = PAGE_TITLE;

  private settings = inject(SettingsService);

  permissionService = inject(PermissionService);
  permissions = PERMISSIONS.roles;

  readonly dialog = inject(MatDialog);

  loading = signal(false);

  selectedAppId: number = 1;
  selectedApp: AppDetails | undefined;
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
    private alertService: AlertService,
    private router: Router
  ) {
    this.dataSource = new TableDataSource<RoleDetails, PaginatedRolesParams>(
      this.roleManagementService,
      this.errorHandler
    );

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
        this.selectedApp = response.items[0];

        this.fetchTableData(this.selectedAppId);
      });
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

  getSelection(roles: RoleDetails[]) {
    this.selected.set(roles);
  }

  private openRoleDetailsDialog(
    mode: RoleDetailsDialogType,
    data?: RoleDetails
  ) {
    const dialogData: RoleDetailsDialogData = {
      mode: mode,
      app: this.selectedApp!,
      roleDetails: data,
    };

    return this.dialog
      .open(RoleDetailsDialogComponent, {
        data: dialogData,
      })
      .afterClosed();
  }

  add() {
    if (this.selectedApp) {
      this.openRoleDetailsDialog('create')
        .pipe(takeUntil(this.destroy$))
        .subscribe((data) => {
          if (data) {
            this.roleManagementService.create(data).subscribe(() => {
              this.fetchTableData(this.selectedAppId);
            });
          }
        });
    } else {
      this.alertService.fetchMessagesAndAlert(
        'warning',
        'roleManagement.alert.appNotSelected.title',
        'roleManagement.alert.appNotSelected.message'
      );
    }
  }

  view(id: string) {
    const roleDetails = this.dataSource.items.find((role) => role.id === id);
    if (roleDetails) {
      this.router.navigate(['/role-management', roleDetails.id]);
    }
  }

  edit(id: string) {
    const roleDetails = this.dataSource.items.find((role) => role.id === id);
    console.log(this.dataSource.items);
    console.log(roleDetails);

    if (roleDetails) {
      if (!this.roleManagementService.isProtected(roleDetails.name, 'edit')) {
        this.roleManagementService
          .confirmEdit(roleDetails)
          .pipe(takeUntil(this.destroy$))
          .subscribe((accepted) => {
            if (accepted) {
              this.openRoleDetailsDialog('edit', roleDetails)
                .pipe(takeUntil(this.destroy$))
                .subscribe((data) => {
                  if (data) {
                    this.roleManagementService.update(data).subscribe(() => {
                      this.fetchTableData(this.selectedAppId);
                    });
                  }
                });
            }
          });
      }
    }
  }

  private hasProtectedRoleSelected(roles: RoleDetails[], action: string) {
    for (const role of roles) {
      if (this.roleManagementService.isProtected(role.name, action)) {
        return true;
      }
    }

    return false;
  }

  activateRoles(ids: string[]) {
    const roles = this.dataSource.items.filter((role) => ids.includes(role.id));

    if (!this.hasProtectedRoleSelected(roles, 'activate')) {
      this.roleManagementService
        .confirmActivation(roles)
        .pipe(takeUntil(this.destroy$))
        .subscribe((accepted) => {
          if (accepted) {
            this.roleManagementService.activate(ids).subscribe(() => {
              this.fetchTableData(this.selectedAppId);
            });
          }
        });
    }
  }

  deactivateRoles(ids: string[]) {
    const roles = this.dataSource.items.filter((role) => ids.includes(role.id));

    if (!this.hasProtectedRoleSelected(roles, 'deactivate')) {
      this.roleManagementService
        .confirmDeactivation(roles)
        .pipe(takeUntil(this.destroy$))
        .subscribe((accepted) => {
          if (accepted) {
            this.roleManagementService.deactivate(ids).subscribe(() => {
              this.fetchTableData(this.selectedAppId);
            });
          }
        });
    }
  }

  deleteRoles(ids: string[]) {
    const roles = this.dataSource.items.filter((role) => ids.includes(role.id));

    if (!this.hasProtectedRoleSelected(roles, 'delete')) {
      this.roleManagementService
        .confirmDelete(roles)
        .pipe(takeUntil(this.destroy$))
        .subscribe((accepted) => {
          if (accepted) {
            this.roleManagementService.delete(ids).subscribe(() => {
              this.fetchTableData(this.selectedAppId);
            });
          }
        });
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
