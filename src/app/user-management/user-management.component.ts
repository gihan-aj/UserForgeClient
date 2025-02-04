import {
  Component,
  effect,
  inject,
  OnDestroy,
  OnInit,
  signal,
} from '@angular/core';
import { Subscription } from 'rxjs';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { UserManagementService } from './services/user-management.service';
import { SettingsService } from '../shared/settings/settings.service';
import { SETTING_KEYS } from '../shared/settings/setting-keys';
import { ErrorHandlingService } from '../shared/error-handling/error-handling.service';
import { TableComponent } from '../shared/widgets/table/table.component';
import { TableDataSource } from '../shared/widgets/table/table-data-source.model';
import { UserDetails } from './interfaces/user-details.interface';
import { SortOrder } from '../shared/widgets/table/sort-order.enum';
import { PermissionService } from '../shared/services/permission.service';
import { PERMISSIONS } from '../shared/constants/permissions';

const PAGE_TITLE = 'User Management';

const FIELDS = [
  'id',
  'firstName',
  'lastName',
  'email',
  'emailConfirmed',
  'phoneNumber',
  'dateOfBirth',
  'isActive',
];

const COLUMNS = [
  'email',
  'firstName',
  'lastName',
  'emailConfirmed',
  'phoneNumber',
  'dateOfBirth',
  'isActive',
];

@Component({
  selector: 'app-user-management',
  imports: [MatButtonModule, MatIconModule, TableComponent],
  templateUrl: './user-management.component.html',
  styleUrl: './user-management.component.scss',
})
export class UserManagementComponent implements OnInit, OnDestroy {
  private settings = inject(SettingsService);
  permissionService = inject(PermissionService);
  permissions = PERMISSIONS.users;
  pageTitle = PAGE_TITLE;

  searchTerm = signal('');
  sortColumn = signal('');
  sortOrder = signal<SortOrder>(SortOrder.ascending);
  page = signal(1);
  pageSize = signal(
    this.settings.defaultSettings[this.settings.settingKeys.pageSize]
  );
  pageSizeKey = SETTING_KEYS.pageSize;

  dataSource: TableDataSource<UserDetails>;
  fields = FIELDS;
  columns = COLUMNS;

  settingsSubscription: Subscription;

  constructor(
    private userManagementService: UserManagementService,
    private errorHandler: ErrorHandlingService
  ) {
    this.settingsSubscription = this.settings.settings$.subscribe(
      (settings) => {
        this.pageSize.set(settings[this.pageSizeKey]);
      }
    );

    this.dataSource = new TableDataSource<UserDetails>(
      this.userManagementService,
      this.errorHandler
    );
  }

  ngOnInit(): void {
    // this.fetchTableData();
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

  // getSelection($event: any[]) {
  //   console.log($event);
  // }

  view($event: any) {
    console.log('view', $event);
  }

  deactivate($event: any) {
    console.log('deactivate', $event);
  }

  activate($event: any) {
    console.log('activate', $event);
  }

  delete($event: any) {
    console.log('delete', $event);
  }

  edit($event: any) {
    console.log('edit', $event);
  }

  ngOnDestroy(): void {
    if (this.settingsSubscription) this.settingsSubscription.unsubscribe();
  }
}
