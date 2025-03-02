import { Component, effect, inject, OnDestroy, signal } from '@angular/core';

import { MatButtonModule } from '@angular/material/button';
import { HasPermissionDirective } from '../shared/directives/has-permission.directive';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';

import { PERMISSIONS } from '../shared/constants/permissions';
import { PermissionService } from '../shared/services/permission.service';
import { SettingsService } from '../shared/settings/settings.service';
import { SortOrder } from '../shared/widgets/table/sort-order.enum';
import { SETTING_KEYS } from '../shared/settings/setting-keys';
import { TableDataSource } from '../shared/widgets/table/table-data-source.model';
import { AppDetails } from './app-details.interface';
import { AppManagementService } from './services/app-management.service';
import { ErrorHandlingService } from '../shared/error-handling/error-handling.service';
import { ConfirmationService } from '../shared/widgets/confirmation-dialog/confirmation.service';
import { AlertService } from '../shared/widgets/alert/alert.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TableComponent } from '../shared/widgets/table/table.component';
import { AppDetailsDialogType } from './app-details-dialog/app-details-dialog.type';
import { AppDetailsDialogData } from './app-details-dialog/app-details-dialog.interface';
import { AppDetailsDialogComponent } from './app-details-dialog/app-details-dialog.component';
import { Subject, Subscription, takeUntil } from 'rxjs';
import { ProtectedDataService } from '../shared/protected-data/protected-data.service';

const PAGE_TITLE = 'App Management';

const FIELDS = ['id', 'name', 'description', 'baseUrl', 'isActive'];

const COLUMNS = ['name', 'description', 'baseUrl', 'isActive'];

@Component({
  selector: 'app-app-management',
  imports: [
    TableComponent,
    MatButtonModule,
    MatIconModule,
    HasPermissionDirective,
  ],
  templateUrl: 'app-management.component.html',
  styleUrl: 'app-management.component.scss',
})
export class AppManagementComponent implements OnDestroy {
  pageTile = PAGE_TITLE;

  private settings = inject(SettingsService);

  permissionService = inject(PermissionService);
  permissions = PERMISSIONS.apps;

  readonly dialog = inject(MatDialog);

  loading = signal(false);

  searchTerm = signal('');
  sortColumn = signal('');
  sortOrder = signal<SortOrder>(SortOrder.ascending);
  page = signal(1);
  pageSize = signal(
    this.settings.defaultSettings[this.settings.settingKeys.pageSize]
  );
  pageSizeKey = SETTING_KEYS.pageSize;

  dataSource: TableDataSource<AppDetails>;
  fields = FIELDS;
  columns = COLUMNS;

  selected = signal<AppDetails[]>([]);

  private destroy$: Subject<void> = new Subject<void>();

  constructor(
    private appManagementService: AppManagementService,
    private errorHandler: ErrorHandlingService,
    private confirmationService: ConfirmationService,
    private alertService: AlertService,
    private protectedData: ProtectedDataService
  ) {
    this.settings.settings$.pipe(takeUntilDestroyed()).subscribe((settings) => {
      this.pageSize.set(settings[this.pageSizeKey]);
    });

    this.dataSource = new TableDataSource<AppDetails>(
      this.appManagementService,
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

  getSelection(roles: AppDetails[]) {
    this.selected.set(roles);
  }

  private openAppDetailsDialog(mode: AppDetailsDialogType, data?: AppDetails) {
    const dialogData: AppDetailsDialogData = {
      mode: mode,
      appDetails: data,
    };

    return this.dialog
      .open(AppDetailsDialogComponent, {
        data: dialogData,
      })
      .afterClosed();
  }

  add() {
    this.openAppDetailsDialog('create')
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        if (data) {
          this.appManagementService.create(data).subscribe(() => {
            this.fetchTableData();
          });
        }
      });
  }

  view(id: number) {
    const appDetails = this.dataSource.items.find((app) => app.id === id);

    if (appDetails) {
      this.openAppDetailsDialog('view', appDetails)
        .pipe(takeUntil(this.destroy$))
        .subscribe((data) => {
          if (data) {
            this.appManagementService.update(data).subscribe(() => {
              this.fetchTableData();
            });
          }
        });
    }
  }

  edit(id: number) {
    const appDetails = this.dataSource.items.find((app) => app.id === id);

    if (appDetails) {
      if (!this.appManagementService.isProtected(appDetails.name, 'edit')) {
        this.appManagementService
          .confirmEdit(appDetails)
          .pipe(takeUntil(this.destroy$))
          .subscribe((accepted) => {
            if (accepted) {
              this.openAppDetailsDialog('edit', appDetails)
                .pipe(takeUntil(this.destroy$))
                .subscribe((data) => {
                  if (data) {
                    this.appManagementService.update(data).subscribe(() => {
                      this.fetchTableData();
                    });
                  }
                });
            }
          });
      }
    }
  }

  private hasProtectedAppSelected(apps: AppDetails[], action: string) {
    for (let i = 0; i < apps.length; i++) {
      if (this.appManagementService.isProtected(apps[i].name, action)) {
        return true;
      }
    }

    return false;
  }

  activateApps(ids: number[]) {
    const apps = this.dataSource.items.filter((app) => ids.includes(app.id));

    if (!this.hasProtectedAppSelected(apps, 'activate')) {
      this.appManagementService
        .confirmActivation(apps)
        .pipe(takeUntil(this.destroy$))
        .subscribe((accepted) => {
          if (accepted) {
            this.appManagementService.activate(ids).subscribe(() => {
              this.fetchTableData();
            });
          }
        });
    }
  }

  deactivateApps(ids: number[]) {
    const apps = this.dataSource.items.filter((app) => ids.includes(app.id));

    if (!this.hasProtectedAppSelected(apps, 'deactivate')) {
      this.appManagementService
        .confirmDeactivation(apps)
        .pipe(takeUntil(this.destroy$))
        .subscribe((accepted) => {
          if (accepted) {
            this.appManagementService.deactivate(ids).subscribe(() => {
              this.fetchTableData();
            });
          }
        });
    }
  }

  deleteApps(ids: number[]) {
    const apps = this.dataSource.items.filter((app) => ids.includes(app.id));

    if (!this.hasProtectedAppSelected(apps, 'delete')) {
      this.appManagementService
        .confirmDelete(apps)
        .pipe(takeUntil(this.destroy$))
        .subscribe((accepted) => {
          if (accepted) {
            this.appManagementService.delete(ids).subscribe(() => {
              this.fetchTableData();
            });
          }
        });
    }
  }

  ngOnDestroy(): void {
    // Emit a value to complete the notifier subject
    this.destroy$.next();
    // Complete the notifier subject itself
    this.destroy$.complete();
  }
}
