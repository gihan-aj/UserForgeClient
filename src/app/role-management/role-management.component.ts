import { Component, effect, inject, signal } from '@angular/core';
import { Subscription } from 'rxjs';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';

import { HasPermissionDirective } from '../shared/directives/has-permission.directive';
import { TableComponent } from '../shared/widgets/table/table.component';
import { PERMISSIONS } from '../shared/constants/permissions';
import { PermissionService } from '../shared/services/permission.service';
import { SETTING_KEYS } from '../shared/settings/setting-keys';
import { SettingsService } from '../shared/settings/settings.service';
import { SortOrder } from '../shared/widgets/table/sort-order.enum';
import { TableDataSource } from '../shared/widgets/table/table-data-source.model';
import { RoleDetails } from './interfaces/role-details.interface';
import { RoleManagementService } from './services/role-management.service';
import { ErrorHandlingService } from '../shared/error-handling/error-handling.service';
import { MessageService } from '../shared/messages/message.service';
import { AlertService } from '../shared/widgets/alert/alert.service';
import { ConfirmationService } from '../shared/widgets/confirmation-dialog/confirmation.service';
import { ABSOLUTE_ROUTES } from '../shared/constants/absolute-routes';

const PAGE_TITLE = 'Role Management';

const FIELDS = ['id', 'name', 'description', 'isActive'];

const COLUMNS = ['name', 'description', 'isActive'];

@Component({
  selector: 'app-role-management',
  imports: [
    MatButtonModule,
    MatIconModule,
    TableComponent,
    HasPermissionDirective,
  ],
  templateUrl: './role-management.component.html',
  styleUrl: './role-management.component.scss',
})
export class RoleManagementComponent {
  private settings = inject(SettingsService);
  permissionService = inject(PermissionService);
  readonly dialog = inject(MatDialog);
  permissions = PERMISSIONS.roles;
  pageTitle = PAGE_TITLE;

  loading = signal(false);

  searchTerm = signal('');
  sortColumn = signal('');
  sortOrder = signal<SortOrder>(SortOrder.ascending);
  page = signal(1);
  pageSize = signal(
    this.settings.defaultSettings[this.settings.settingKeys.pageSize]
  );
  pageSizeKey = SETTING_KEYS.pageSize;

  dataSource: TableDataSource<RoleDetails>;
  fields = FIELDS;
  columns = COLUMNS;

  selected = signal<RoleDetails[]>([]);

  settingsSubscription: Subscription;

  constructor(
    private roleManagementService: RoleManagementService,
    private errorHandler: ErrorHandlingService,
    private confirmationService: ConfirmationService,
    private msgService: MessageService,
    private alertService: AlertService
  ) {
    this.settingsSubscription = this.settings.settings$.subscribe(
      (settings) => {
        this.pageSize.set(settings[this.pageSizeKey]);
      }
    );

    this.dataSource = new TableDataSource<RoleDetails>(
      this.roleManagementService,
      this.errorHandler
    );
  }

  private fetchTableData() {
    this.dataSource.loadData(
      this.page(),
      this.pageSize(),
      this.sortColumn(),
      this.sortOrder(),
      this.searchTerm()
    );
  }

  refreshTable = effect(() => {
    this.fetchTableData();
  });

  getSelection(roles: RoleDetails[]) {
    this.selected.set(roles);
  }

  view(id: string) {}
}
