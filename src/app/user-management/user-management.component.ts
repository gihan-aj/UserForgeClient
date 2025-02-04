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
import { ConfirmationService } from '../shared/widgets/confirmation-dialog/confirmation.service';
import { MessageService } from '../shared/messages/message.service';
import { AlertType } from '../shared/widgets/alert/alert-type.enum';
import { AlertService } from '../shared/widgets/alert/alert.service';

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

  selected = signal<UserDetails[]>([]);

  settingsSubscription: Subscription;
  deactivateConfirmSubscription: Subscription | undefined;
  activateConfirmSubscription: Subscription | undefined;
  deleteConfirmSubscription: Subscription | undefined;

  constructor(
    private userManagementService: UserManagementService,
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

  getSelection(users: UserDetails[]) {
    this.selected.set(users);
  }

  view($event: any) {}

  deactivate(userIds: string[]) {
    const title = this.msgService.getMessage(
      'userManagement.confirmation.deactivateUsers.title'
    );

    let message = '';
    if (userIds.length === 1) {
      const userEmail = this.dataSource.items.find(
        (user) => user.id === userIds[0]
      )?.email;

      message = this.msgService.getMessage(
        'userManagement.confirmation.deactivateUsers.messageSingle',
        { email: userEmail! }
      );
    } else {
      message = this.msgService.getMessage(
        'userManagement.confirmation.deactivateUsers.message'
      );
    }

    const action = this.msgService.getMessage(
      'userManagement.confirmation.deactivateUsers.action'
    );

    this.deactivateConfirmSubscription = this.confirmationService
      .confirm(AlertType.Warning, title, message, action)
      .subscribe((accepted) => {
        if (accepted) {
          this.deactivateUsers(userIds);
        }
      });
  }

  private deactivateUsers(ids: string[]) {
    this.userManagementService.deactivate(ids).subscribe({
      next: (res) => {
        const title = this.msgService.getMessage(
          'userManagement.alert.deactivate.success.title'
        );
        this.alertService.showAlert(AlertType.Success, title, res.message);
        this.fetchTableData();
      },
      error: (error) => {
        this.errorHandler.handle(error);
      },
    });
  }

  activate(userIds: string[]) {
    const title = this.msgService.getMessage(
      'userManagement.confirmation.activateUsers.title'
    );

    let message = '';
    if (userIds.length === 1) {
      const userEmail = this.dataSource.items.find(
        (user) => user.id === userIds[0]
      )?.email;

      message = this.msgService.getMessage(
        'userManagement.confirmation.activateUsers.messageSingle',
        { email: userEmail! }
      );
    } else {
      message = this.msgService.getMessage(
        'userManagement.confirmation.activateUsers.message'
      );
    }

    const action = this.msgService.getMessage(
      'userManagement.confirmation.activateUsers.action'
    );

    this.activateConfirmSubscription = this.confirmationService
      .confirm(AlertType.Warning, title, message, action)
      .subscribe((accepted) => {
        if (accepted) {
          this.activateUsers(userIds);
        }
      });
  }

  private activateUsers(ids: string[]) {
    this.userManagementService.activate(ids).subscribe({
      next: (res) => {
        const title = this.msgService.getMessage(
          'userManagement.alert.activate.success.title'
        );
        this.alertService.showAlert(AlertType.Success, title, res.message);
        this.fetchTableData();
      },
      error: (error) => {
        this.errorHandler.handle(error);
      },
    });
  }

  delete(userIds: string[]) {
    const title = this.msgService.getMessage(
      'userManagement.confirmation.deleteUsers.title'
    );

    let message = '';
    if (userIds.length === 1) {
      const userEmail = this.dataSource.items.find(
        (user) => user.id === userIds[0]
      )?.email;

      message = this.msgService.getMessage(
        'userManagement.confirmation.deleteUsers.messageSingle',
        { email: userEmail! }
      );
    } else {
      message = this.msgService.getMessage(
        'userManagement.confirmation.deleteUsers.message'
      );
    }

    const action = this.msgService.getMessage(
      'userManagement.confirmation.deleteUsers.action'
    );

    this.deleteConfirmSubscription = this.confirmationService
      .confirm(AlertType.Warning, title, message, action)
      .subscribe((accepted) => {
        if (accepted) {
          this.deleteUsers(userIds);
        }
      });
  }

  private deleteUsers(ids: string[]) {
    this.userManagementService.delete(ids).subscribe({
      next: (res) => {
        const title = this.msgService.getMessage(
          'userManagement.alert.delete.success.title'
        );
        this.alertService.showAlert(AlertType.Success, title, res.message);
        this.fetchTableData();
      },
      error: (error) => {
        this.errorHandler.handle(error);
      },
    });
  }

  edit($event: any) {
    console.log('edit', $event);
  }

  ngOnDestroy(): void {
    if (this.settingsSubscription) this.settingsSubscription.unsubscribe();
    if (this.deactivateConfirmSubscription)
      this.deactivateConfirmSubscription.unsubscribe();
    if (this.activateConfirmSubscription)
      this.activateConfirmSubscription.unsubscribe();
  }
}
