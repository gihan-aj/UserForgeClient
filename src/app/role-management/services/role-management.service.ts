import { Injectable } from '@angular/core';
import { RoleDetails } from '../interfaces/role-details.interface';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';

import { PaginatedList } from '../../shared/interfaces/paginated-list.interface';
import { environment } from '../../../environments/environment';
import {
  APP_ID,
  PAGE,
  PAGE_SIZE,
  ROLE_ID,
  SEARCH_TERM,
  SORT_COLUMN,
  SORT_ORDER,
} from '../../shared/constants/query-params';
import { FetchPaginatedData } from '../../shared/interfaces/fetch-paginated-data.interface';
import { PaginatedRolesParams } from '../interfaces/paginated-roles-params.interface';
import { CreateRoleRequest } from '../interfaces/create-role-request.interface';
import { NotificationService } from '../../shared/widgets/notification/notification.service';
import { ErrorHandlingService } from '../../shared/error-handling/error-handling.service';
import { ProtectedDataService } from '../../shared/protected-data/protected-data.service';
import { AlertService } from '../../shared/widgets/alert/alert.service';
import { ConfirmationService } from '../../shared/widgets/confirmation-dialog/confirmation.service';
import { EditRoleDetailsRequest } from '../interfaces/edit-role-details-request.interface';
import { BulkIdsRequest } from '../../shared/interfaces/bulk-ids-request.interface';
import { RoleDetailsWithPermissions } from '../interfaces/role-details-with-permissions.interface';

@Injectable({
  providedIn: 'root',
})
export class RoleManagementService
  implements FetchPaginatedData<RoleDetails, PaginatedRolesParams>
{
  private readonly baseUrl = `${environment.baseUrl}/roles`;

  constructor(
    private http: HttpClient,
    private notificationService: NotificationService,
    private errorHandling: ErrorHandlingService,
    private protectedData: ProtectedDataService,
    private alertService: AlertService,
    private confirmationService: ConfirmationService
  ) {}

  fetchDataSet(
    params: PaginatedRolesParams
  ): Observable<PaginatedList<RoleDetails>> {
    const url = this.baseUrl;

    let queryParams = new HttpParams();
    queryParams = queryParams.append(PAGE, params.page.toString());
    queryParams = queryParams.append(PAGE_SIZE, params.pageSize.toString());
    if (params.searchTerm) {
      queryParams = queryParams.append(SEARCH_TERM, params.searchTerm);
    }
    if (params.sortColumn) {
      queryParams = queryParams.append(SORT_COLUMN, params.sortColumn);
    }
    if (params.sortOrder) {
      queryParams = queryParams.append(SORT_ORDER, params.sortOrder);
    }

    queryParams = queryParams.append(APP_ID, params.appId.toString());

    return this.http.get<PaginatedList<RoleDetails>>(url, {
      params: queryParams,
    });
  }

  create(roleDetails: CreateRoleRequest) {
    const url = `${this.baseUrl}/create`;
    return this.http.post<void>(url, roleDetails).pipe(
      tap(() => {
        this.notificationService.fetchMessagesAndNotify(
          'success',
          'roleManagement.notification.create.success'
        );
      }),
      catchError((error) => {
        this.errorHandling.handle(error);
        this.notificationService.fetchMessagesAndNotify(
          'danger',
          'roleManagement.notification.create.fail'
        );
        return throwError(() => error);
      })
    );
  }

  isProtected(roleName: string, action: string) {
    if (this.protectedData.isProtectedRole(roleName)) {
      this.alertService.fetchMessagesAndAlert(
        'danger',
        'roleManagement.alert.protected.title',
        'roleManagement.alert.protected.message',
        { action: action }
      );

      return true;
    }

    return false;
  }

  confirmEdit(role: RoleDetails): Observable<boolean> {
    return this.confirmationService.fetchMessagesAndConfirm(
      'warning',
      'roleManagement.confirmation.edit.title',
      'roleManagement.confirmation.edit.message',
      'roleManagement.confirmation.edit.action',
      { roleName: role.name }
    );
  }

  update(roleDetails: EditRoleDetailsRequest) {
    const url = `${this.baseUrl}/update`;
    return this.http.put<void>(url, roleDetails).pipe(
      tap(() => {
        this.notificationService.fetchMessagesAndNotify(
          'success',
          'roleManagement.notification.edit.success'
        );
      }),
      catchError((error) => {
        this.errorHandling.handle(error);
        this.notificationService.fetchMessagesAndNotify(
          'danger',
          'roleManagement.notification.edit.fail'
        );
        return throwError(() => error);
      })
    );
  }

  confirmActivation(roles: RoleDetails[]): Observable<boolean> {
    if (roles.length === 1) {
      return this.confirmationService.fetchMessagesAndConfirm(
        'warning',
        'roleManagement.confirmation.activate.title',
        'roleManagement.confirmation.activate.message.single',
        'roleManagement.confirmation.activate.action',
        { roleName: roles[0].name }
      );
    }

    return this.confirmationService.fetchMessagesAndConfirm(
      'warning',
      'roleManagement.confirmation.activate.title',
      'roleManagement.confirmation.activate.message.multiple',
      'roleManagement.confirmation.activate.action'
    );
  }

  activate(ids: string[]) {
    const url = `${this.baseUrl}/activate`;
    const body: BulkIdsRequest<string> = {
      ids: ids,
    };
    return this.http.put<{ message: string }>(url, body).pipe(
      tap((res) => {
        ids.length === 1
          ? this.notificationService.fetchMessagesAndNotify(
              'success',
              'roleManagement.notification.activate.success.single'
            )
          : this.notificationService.fetchMessagesAndNotify(
              'success',
              'roleManagement.notification.activate.success.multiple'
            );

        this.alertService.fetchMessagesAndAlertWithBackendMessage(
          'success',
          'roleManagement.alert.activate.title',
          res.message
        );
      }),
      catchError((error) => {
        ids.length === 1
          ? this.notificationService.fetchMessagesAndNotify(
              'danger',
              'roleManagement.notification.activate.fail.single'
            )
          : this.notificationService.fetchMessagesAndNotify(
              'danger',
              'roleManagement.notification.activate.fail.multiple'
            );
        this.errorHandling.handle(error);
        return throwError(() => error);
      })
    );
  }

  confirmDeactivation(roles: RoleDetails[]): Observable<boolean> {
    if (roles.length === 1) {
      return this.confirmationService.fetchMessagesAndConfirm(
        'warning',
        'appManagement.confirmation.deactivate.title',
        'appManagement.confirmation.deactivate.message.single',
        'appManagement.confirmation.deactivate.action',
        { roleName: roles[0].name }
      );
    }

    return this.confirmationService.fetchMessagesAndConfirm(
      'warning',
      'appManagement.confirmation.deactivate.title',
      'appManagement.confirmation.deactivate.message.multiple',
      'appManagement.confirmation.deactivate.action'
    );
  }

  deactivate(ids: string[]) {
    const url = `${this.baseUrl}/deactivate`;
    const body: BulkIdsRequest<string> = {
      ids: ids,
    };
    return this.http.put<{ message: string }>(url, body).pipe(
      tap((res) => {
        ids.length === 1
          ? this.notificationService.fetchMessagesAndNotify(
              'success',
              'roleManagement.notification.deactivate.success.single'
            )
          : this.notificationService.fetchMessagesAndNotify(
              'success',
              'roleManagement.notification.deactivate.success.multiple'
            );

        this.alertService.fetchMessagesAndAlertWithBackendMessage(
          'success',
          'roleManagement.alert.deactivate.title',
          res.message
        );
      }),
      catchError((error) => {
        ids.length === 1
          ? this.notificationService.fetchMessagesAndNotify(
              'danger',
              'roleManagement.notification.deactivate.fail.single'
            )
          : this.notificationService.fetchMessagesAndNotify(
              'danger',
              'roleManagement.notification.deactivate.fail.multiple'
            );
        this.errorHandling.handle(error);
        return throwError(() => error);
      })
    );
  }

  confirmDelete(roles: RoleDetails[]): Observable<boolean> {
    if (roles.length === 1) {
      return this.confirmationService.fetchMessagesAndConfirm(
        'danger',
        'roleManagement.confirmation.delete.title',
        'roleManagement.confirmation.delete.message.single',
        'roleManagement.confirmation.delete.action',
        { roleName: roles[0].name }
      );
    }

    return this.confirmationService.fetchMessagesAndConfirm(
      'danger',
      'roleManagement.confirmation.delete.title',
      'roleManagement.confirmation.delete.message.multiple',
      'roleManagement.confirmation.delete.action'
    );
  }

  delete(ids: string[]) {
    const url = `${this.baseUrl}/delete`;
    const body: BulkIdsRequest<string> = {
      ids: ids,
    };
    return this.http.put<{ message: string }>(url, body).pipe(
      tap((res) => {
        ids.length === 1
          ? this.notificationService.fetchMessagesAndNotify(
              'success',
              'roleManagement.notification.delete.success.single'
            )
          : this.notificationService.fetchMessagesAndNotify(
              'success',
              'roleManagement.notification.delete.success.multiple'
            );

        this.alertService.fetchMessagesAndAlertWithBackendMessage(
          'success',
          'roleManagement.alert.delete.title',
          res.message
        );
      }),
      catchError((error) => {
        ids.length === 1
          ? this.notificationService.fetchMessagesAndNotify(
              'danger',
              'roleManagement.notification.delete.fail.single'
            )
          : this.notificationService.fetchMessagesAndNotify(
              'danger',
              'roleManagement.notification.delete.fail.multiple'
            );
        this.errorHandling.handle(error);
        return throwError(() => error);
      })
    );
  }

  fetchRoleWithPermissions(id: string): Observable<RoleDetailsWithPermissions> {
    const url = `${this.baseUrl}/permissions`;

    const params = new HttpParams().set(ROLE_ID, id);
    return this.http.get<RoleDetailsWithPermissions>(url, { params }).pipe(
      catchError((error) => {
        this.errorHandling.handle(error);
        return throwError(() => error);
      })
    );
  }
}
