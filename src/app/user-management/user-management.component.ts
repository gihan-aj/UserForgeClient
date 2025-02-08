import {
  Component,
  effect,
  inject,
  OnDestroy,
  OnInit,
  signal,
} from '@angular/core';
import { map, Subscription, switchMap, tap } from 'rxjs';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';

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
import { DialogMode } from '../shared/enums/dialog-mode.enum';
import { UserDetailsDialog } from './user-details-dialog/user-details-dialog.interface';
import { UserDetailsDialogComponent } from './user-details-dialog/user-details-dialog.component';
import { HasPermissionDirective } from '../shared/directives/has-permission.directive';
import { UserRolesDialog } from './user-roles-dialog/user-roles-dialog.interface';
import { UserRolesDialogComponent } from './user-roles-dialog/user-roles-dialog.component';
import { AssignRolesRequest } from './interfaces/assign-roles.interface';
import { RoleAssignStatus } from './interfaces/role-assign-status.interface';
import { BulkAssignRolesRequest } from './interfaces/bulk-assign-roles-request.interface';

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
  imports: [
    MatButtonModule,
    MatIconModule,
    TableComponent,
    HasPermissionDirective,
  ],
  templateUrl: './user-management.component.html',
  styleUrl: './user-management.component.scss',
})
export class UserManagementComponent implements OnInit, OnDestroy {
  private settings = inject(SettingsService);
  permissionService = inject(PermissionService);
  readonly dialog = inject(MatDialog);
  permissions = PERMISSIONS.users;
  pageTitle = PAGE_TITLE;
  roleManagePermission = PERMISSIONS.users.manageRoles;
  roleReadPermission = PERMISSIONS.users.readRoles;

  loading = signal(false);

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
  editConfirmSubscription: Subscription | undefined;
  dialogClosedSubscription: Subscription | undefined;
  assignRolesDialogClosedSubscription: Subscription | undefined;

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
    console.log(this.selected());
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

  private isDefaultUser(id: string): boolean {
    const user = this.dataSource.items.find((u) => u.id === id);
    if (user) {
      return user.email.includes('@userforge.com');
    }
    return false;
  }

  private hasDefaultUserSelected(ids: string[]): boolean {
    let defaultUserSelected = false;
    ids.forEach((id) => {
      if (this.isDefaultUser(id)) {
        defaultUserSelected = true;
      }
    });

    return defaultUserSelected;
  }

  refreshTable = effect(() => {
    this.fetchTableData();
  });

  getSelection(users: UserDetails[]) {
    this.selected.set(users);
  }

  private openUserDetailsDialog(mode: DialogMode, data?: UserDetails) {
    const dialogData: UserDetailsDialog = {
      mode: mode,
      title:
        mode === DialogMode.View
          ? 'User Details'
          : mode === DialogMode.Edit
          ? 'Edit User Details'
          : 'Add New User',
      userDetails: data,
    };

    const dialogRef = this.dialog.open(UserDetailsDialogComponent, {
      data: dialogData,
    });

    this.dialogClosedSubscription = dialogRef
      .afterClosed()
      .subscribe((result) => {
        if (result) {
        }
      });
  }

  view(id: any) {
    const userDetails = this.dataSource.items.find((user) => user.id === id);
    console.log(userDetails);

    if (userDetails) {
      this.openUserDetailsDialog(DialogMode.View, userDetails);
    }
  }

  deactivate(userIds: string[]) {
    if (this.hasDefaultUserSelected(userIds)) {
      this.alertService.showAlert(
        AlertType.Danger,
        this.msgService.getMessage(
          'userManagement.alert.restrictedAction.title'
        ),
        this.msgService.getMessage(
          'userManagement.alert.restrictedAction.mssage',
          { action: 'deactivate' }
        )
      );
    } else {
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
    if (this.hasDefaultUserSelected(userIds)) {
      this.alertService.showAlert(
        AlertType.Danger,
        this.msgService.getMessage(
          'userManagement.alert.restrictedAction.title'
        ),
        this.msgService.getMessage(
          'userManagement.alert.restrictedAction.mssage',
          { action: 'activate' }
        )
      );
    } else {
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
    if (this.hasDefaultUserSelected(userIds)) {
      this.alertService.showAlert(
        AlertType.Danger,
        this.msgService.getMessage(
          'userManagement.alert.restrictedAction.title'
        ),
        this.msgService.getMessage(
          'userManagement.alert.restrictedAction.mssage',
          { action: 'delete' }
        )
      );
    } else {
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

  edit(id: string) {
    if (this.isDefaultUser(id)) {
      this.alertService.showAlert(
        AlertType.Danger,
        this.msgService.getMessage(
          'userManagement.alert.restrictedAction.title'
        ),
        this.msgService.getMessage(
          'userManagement.alert.restrictedAction.mssage',
          { action: 'edit' }
        )
      );
    } else {
      const userDetails = this.dataSource.items.find((user) => user.id === id);
      console.log(userDetails);

      if (userDetails) {
        const title = this.msgService.getMessage(
          'userManagement.confirmation.editUser.title'
        );
        const message = this.msgService.getMessage(
          'userManagement.confirmation.editUser.message',
          { email: userDetails.email! }
        );
        const action = this.msgService.getMessage(
          'userManagement.confirmation.editUser.action'
        );

        this.editConfirmSubscription = this.confirmationService
          .confirm(AlertType.Warning, title, message, action)
          .subscribe((accepted) => {
            if (accepted) {
              this.openUserDetailsDialog(DialogMode.Edit, userDetails);
            }
          });
      }
    }
  }

  viewUserRoles() {
    if (this.selected().length === 1) {
      const user = this.selected()[0];

      this.userManagementService.getUserRoles(user.id).subscribe({
        next: (response) => {
          const dialogData: UserRolesDialog = {
            mode: DialogMode.View,
            user: user,
            roles: response.map((roleName) => ({
              roleName: roleName,
              isAssigned: true,
            })),
          };

          const dialogRef = this.dialog.open(UserRolesDialogComponent, {
            data: dialogData,
          });
        },
        error: (error) => {
          this.errorHandler.handle(error);
        },
      });
    }
  }

  assignUserRoles() {
    if (this.selected().length === 1) {
      const user = this.selected()[0];

      if (this.isDefaultUser(user.id)) {
        this.alertService.showAlert(
          AlertType.Danger,
          this.msgService.getMessage(
            'userManagement.alert.restrictedAction.title'
          ),
          this.msgService.getMessage(
            'userManagement.alert.restrictedAction.mssage',
            { action: 'change roles of' }
          )
        );
      } else {
        const allRoles: { roleName: string; isAssigned: boolean }[] = [];

        this.userManagementService
          .getRoleNames()
          .pipe(
            tap((response) => {
              response.forEach((roleName) => {
                allRoles.push({ roleName: roleName, isAssigned: false });
              });
            }),
            switchMap(() =>
              this.userManagementService.getUserRoles(user.id).pipe(
                tap((userRoleNames) => {
                  userRoleNames.forEach((ur) => {
                    const tempRole = allRoles.find((ar) => ar.roleName === ur);
                    if (tempRole) {
                      tempRole.isAssigned = true;
                    }
                  });
                })
              )
            )
          )
          .subscribe({
            next: () => {
              const dialogData: UserRolesDialog = {
                mode: DialogMode.Edit,
                user: user,
                roles: allRoles,
              };

              this.confirmChangeRoles(dialogData);
            },
            error: (error) => {
              this.errorHandler.handle(error);
            },
          });
      }
    } else if (this.selected().length > 1) {
      const userIds = this.selected().map((u) => u.id);
      const userEmails = this.selected().map((u) => u.email);
      if (this.hasDefaultUserSelected(userIds)) {
        this.alertService.showAlert(
          AlertType.Danger,
          this.msgService.getMessage(
            'userManagement.alert.restrictedAction.title'
          ),
          this.msgService.getMessage(
            'userManagement.alert.restrictedAction.mssage',
            { action: 'change roles of' }
          )
        );
      } else {
        const allRoles: { roleName: string; isAssigned: boolean }[] = [];

        this.userManagementService.getRoleNames().subscribe({
          next: (response) => {
            response.forEach((roleName) => {
              allRoles.push({ roleName: roleName, isAssigned: false });
            });

            const dialogData: UserRolesDialog = {
              mode: DialogMode.Edit,
              userIds: userIds,
              userEmails: userEmails,
              roles: allRoles,
            };

            this.confirmChangeRoles(dialogData);
          },
          error: (error) => {
            this.errorHandler.handle(error);
          },
        });
      }
    }
  }

  private confirmChangeRoles(dialogData: UserRolesDialog) {
    if (this.selected().length === 1) {
      this.confirmationService
        .confirm(
          AlertType.Warning,
          this.msgService.getMessage(
            'userManagement.confirmation.assignRoles.title'
          ),
          this.msgService.getMessage(
            'userManagement.confirmation.assignRoles.messageSingle',
            { email: dialogData.user?.email! }
          ),
          this.msgService.getMessage(
            'userManagement.confirmation.assignRoles.action'
          )
        )
        .subscribe((accepted) => {
          if (accepted) {
            this.openAssignRolesDialog(dialogData);
          }
        });
    } else if (this.selected().length > 1) {
      this.confirmationService
        .confirm(
          AlertType.Warning,
          this.msgService.getMessage(
            'userManagement.confirmation.assignRoles.title'
          ),
          this.msgService.getMessage(
            'userManagement.confirmation.assignRoles.message'
          ),
          this.msgService.getMessage(
            'userManagement.confirmation.assignRoles.action'
          )
        )
        .subscribe((accepted) => {
          if (accepted) {
            this.openAssignRolesDialog(dialogData);
          }
        });
    }
  }

  private openAssignRolesDialog(dialogData: UserRolesDialog) {
    const dialogRef = this.dialog.open(UserRolesDialogComponent, {
      data: dialogData,
    });

    this.assignRolesDialogClosedSubscription = dialogRef
      .afterClosed()
      .subscribe((data: RoleAssignStatus[]) => {
        if (data) {
          const assignedRoleNames = data
            .filter((ras) => ras.isAssigned === true)
            .map((ras) => ras.roleName);

          if (assignedRoleNames.length > 0) {
            if (dialogData.user) {
              const req: AssignRolesRequest = {
                userId: dialogData.user.id,
                roleNames: assignedRoleNames,
              };

              this.loading.set(true);
              this.userManagementService.assignRoles(req).subscribe({
                next: (res) => {
                  this.loading.set(false)

                  if (assignedRoleNames.length === 1) {
                    this.alertService.showAlert(
                      AlertType.Success,
                      this.msgService.getMessage(
                        'userManagement.alert.assignRole.success.title'
                      ),
                      res.message
                    );
                  } else {
                    this.alertService.showAlert(
                      AlertType.Success,
                      this.msgService.getMessage(
                        'userManagement.alert.assignRoles.success.title'
                      ),
                      res.message
                    );
                  }
                },
                error: (error) => {
                  this.loading.set(false);
                  this.errorHandler.handle(error);
                },
              });
            } else if (dialogData.userIds) {
              const req: BulkAssignRolesRequest = {
                userIds: dialogData.userIds,
                roleNames: assignedRoleNames,
              };

              this.loading.set(true);
              this.userManagementService.bulkAssignRoles(req).subscribe({
                next: () => {
                  this.loading.set(false);
                  if (assignedRoleNames.length === 1) {
                    this.alertService.showAlert(
                      AlertType.Success,
                      this.msgService.getMessage(
                        'userManagement.alert.assignRole.success.title'
                      ),
                      this.msgService.getMessage(
                        'userManagement.alert.assignRole.success.message'
                      )
                    );
                  } else {
                    this.alertService.showAlert(
                      AlertType.Success,
                      this.msgService.getMessage(
                        'userManagement.alert.assignRoles.success.title'
                      ),
                      this.msgService.getMessage(
                        'userManagement.alert.assignRoles.success.message'
                      )
                    );
                  }
                },
                error: (error) => {
                  this.loading.set(false);
                  this.errorHandler.handle(error);
                },
              });
            }
          } else {
            this.alertService.showAlert(
              AlertType.Warning,
              this.msgService.getMessage(
                'userManagement.alert.noRolesAssigned.title'
              ),
              this.msgService.getMessage(
                'userManagement.alert.noRolesAssigned.mssage'
              )
            );
          }
        }
      });
  }

  ngOnDestroy(): void {
    if (this.settingsSubscription) this.settingsSubscription.unsubscribe();
    if (this.deactivateConfirmSubscription)
      this.deactivateConfirmSubscription.unsubscribe();
    if (this.activateConfirmSubscription)
      this.activateConfirmSubscription.unsubscribe();
    if (this.dialogClosedSubscription)
      this.dialogClosedSubscription.unsubscribe();
    if (this.editConfirmSubscription)
      this.editConfirmSubscription.unsubscribe();
    if (this.assignRolesDialogClosedSubscription)
      this.assignRolesDialogClosedSubscription.unsubscribe();
  }
}
