import { Injectable } from '@angular/core';
import { FetchDataSet } from '../../shared/interfaces/fetch-data-set.interface';
import { AppDetails } from '../app-details.interface';
import { catchError, Observable, of, tap, throwError } from 'rxjs';
import { PaginatedList } from '../../shared/interfaces/paginated-list.interface';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import {
  PAGE,
  PAGE_SIZE,
  SEARCH_TERM,
  SORT_COLUMN,
  SORT_ORDER,
} from '../../shared/constants/query-params';
import { CreateAppRequest } from '../interfaces/create-app-request.interface';
import { NotificationService } from '../../shared/widgets/notification/notification.service';
import { ErrorHandlingService } from '../../shared/error-handling/error-handling.service';
import { UpdateAppDetailsRequest } from '../interfaces/update-app-details-request.interface';
import { BulkIdsRequest } from '../../shared/interfaces/bulk-ids-request.interface';
import { ConfirmationService } from '../../shared/widgets/confirmation-dialog/confirmation.service';
import { ProtectedDataService } from '../../shared/protected-data/protected-data.service';
import { AlertService } from '../../shared/widgets/alert/alert.service';

@Injectable({
  providedIn: 'root',
})
export class AppManagementService implements FetchDataSet<AppDetails> {
  private readonly baseUrl = `${environment.baseUrl}/apps`;

  constructor(
    private http: HttpClient,
    private notificationService: NotificationService,
    private confirmationService: ConfirmationService,
    private errorHandling: ErrorHandlingService,
    private protectedData: ProtectedDataService,
    private alertService: AlertService
  ) {}

  fetchDataSet(
    page: number,
    pageSize: number,
    sortColumn?: string,
    sortOrder?: string,
    searchTerm?: string
  ): Observable<PaginatedList<AppDetails>> {
    const url = this.baseUrl;

    let queryParams = new HttpParams();
    if (searchTerm) {
      queryParams = queryParams.append(SEARCH_TERM, searchTerm);
    }
    if (sortColumn) {
      queryParams = queryParams.append(SORT_COLUMN, sortColumn);
    }
    if (sortOrder) {
      queryParams = queryParams.append(SORT_ORDER, sortOrder);
    }
    queryParams = queryParams.append(PAGE, page.toString());
    queryParams = queryParams.append(PAGE_SIZE, pageSize.toString());

    return this.http.get<PaginatedList<AppDetails>>(url, {
      params: queryParams,
    });
  }

  create(appDetails: CreateAppRequest) {
    const url = `${this.baseUrl}/create`;
    return this.http.post<void>(url, appDetails).pipe(
      tap(() => {
        this.notificationService.fetchMessagesAndNotify(
          'success',
          'appManagement.notification.create.success'
        );
      }),
      catchError((error) => {
        this.errorHandling.handle(error);
        this.notificationService.fetchMessagesAndNotify(
          'danger',
          'appManagement.notification.create.fail'
        );
        return throwError(() => error);
      })
    );
  }

  isProtected(appName: string, action: string): boolean {
    if (this.protectedData.isProtectedApp(appName)) {
      this.alertService.fetchMessagesAndAlert(
        'danger',
        'appManagement.alert.protected.title',
        'appManagement.alert.protected.message',
        { action: action }
      );

      return true;
    }

    return false;
  }

  confirmEdit(app: AppDetails): Observable<boolean> {
    return this.confirmationService.fetchMessagesAndConfirm(
      'warning',
      'appManagement.confirmation.editApp.title',
      'appManagement.confirmation.editApp.message',
      'appManagement.confirmation.editApp.action',
      { appName: app.name }
    );
  }

  update(appDetails: UpdateAppDetailsRequest) {
    const url = `${this.baseUrl}/update`;
    return this.http.put<void>(url, appDetails).pipe(
      tap(() => {
        this.notificationService.fetchMessagesAndNotify(
          'success',
          'appManagement.notification.edit.success'
        );
      }),
      catchError((error) => {
        this.errorHandling.handle(error);
        this.notificationService.fetchMessagesAndNotify(
          'danger',
          'appManagement.notification.edit.fail'
        );
        return throwError(() => error);
      })
    );
  }

  confirmActivation(apps: AppDetails[]): Observable<boolean> {
    if (apps.length === 1) {
      return this.confirmationService.fetchMessagesAndConfirm(
        'warning',
        'appManagement.confirmation.activate.title',
        'appManagement.confirmation.activate.message.single',
        'appManagement.confirmation.activate.action',
        { appName: apps[0].name }
      );
    }

    return this.confirmationService.fetchMessagesAndConfirm(
      'warning',
      'appManagement.confirmation.activate.title',
      'appManagement.confirmation.activate.message.multiple',
      'appManagement.confirmation.activate.action'
    );
  }

  activate(ids: number[]) {
    const url = `${this.baseUrl}/activate`;
    const body: BulkIdsRequest<number> = {
      ids: ids,
    };
    return this.http.put<{ message: string }>(url, body).pipe(
      tap((res) => {
        ids.length === 1
          ? this.notificationService.fetchMessagesAndNotify(
              'success',
              'appManagement.notification.activate.success.single'
            )
          : this.notificationService.fetchMessagesAndNotify(
              'success',
              'appManagement.notification.activate.success.multiple'
            );

        this.alertService.fetchMessagesAndAlertWithBackendMessage(
          'success',
          'appManagement.alert.activate.title',
          res.message
        );
      }),
      catchError((error) => {
        ids.length === 1
          ? this.notificationService.fetchMessagesAndNotify(
              'danger',
              'appManagement.notification.activate.fail.single'
            )
          : this.notificationService.fetchMessagesAndNotify(
              'danger',
              'appManagement.notification.activate.fail.multiple'
            );
        this.errorHandling.handle(error);
        return throwError(() => error);
      })
    );
  }

  confirmDeactivation(apps: AppDetails[]): Observable<boolean> {
    if (apps.length === 1) {
      return this.confirmationService.fetchMessagesAndConfirm(
        'warning',
        'appManagement.confirmation.deactivate.title',
        'appManagement.confirmation.deactivate.message.single',
        'appManagement.confirmation.deactivate.action',
        { appName: apps[0].name }
      );
    }

    return this.confirmationService.fetchMessagesAndConfirm(
      'warning',
      'appManagement.confirmation.deactivate.title',
      'appManagement.confirmation.deactivate.message.multiple',
      'appManagement.confirmation.deactivate.action'
    );
  }

  deactivate(ids: number[]) {
    const url = `${this.baseUrl}/deactivate`;
    const body: BulkIdsRequest<number> = {
      ids: ids,
    };
    return this.http.put<{ message: string }>(url, body).pipe(
      tap((res) => {
        ids.length === 1
          ? this.notificationService.fetchMessagesAndNotify(
              'success',
              'appManagement.notification.deactivate.success.single'
            )
          : this.notificationService.fetchMessagesAndNotify(
              'success',
              'appManagement.notification.deactivate.success.multiple'
            );

            this.alertService.fetchMessagesAndAlertWithBackendMessage(
              'success',
              'appManagement.alert.deactivate.title',
              res.message
            );
      }),
      catchError((error) => {
        ids.length === 1
          ? this.notificationService.fetchMessagesAndNotify(
              'danger',
              'appManagement.notification.deactivate.fail.single'
            )
          : this.notificationService.fetchMessagesAndNotify(
              'danger',
              'appManagement.notification.deactivate.fail.multiple'
            );
        this.errorHandling.handle(error);
        return throwError(() => error);
      })
    );
  }

  confirmDelete(apps: AppDetails[]): Observable<boolean> {
    if (apps.length === 1) {
      return this.confirmationService.fetchMessagesAndConfirm(
        'danger',
        'appManagement.confirmation.delete.title',
        'appManagement.confirmation.delete.message.single',
        'appManagement.confirmation.delete.action',
        { appName: apps[0].name }
      );
    }

    return this.confirmationService.fetchMessagesAndConfirm(
      'danger',
      'appManagement.confirmation.delete.title',
      'appManagement.confirmation.delete.message.multiple',
      'appManagement.confirmation.delete.action'
    );
  }

  delete(ids: number[]) {
    const url = `${this.baseUrl}/delete`;
    const body: BulkIdsRequest<number> = {
      ids: ids,
    };
    return this.http.put<{ message: string }>(url, body).pipe(
      tap((res) => {
        ids.length === 1
          ? this.notificationService.fetchMessagesAndNotify(
              'success',
              'appManagement.notification.delete.success.single'
            )
          : this.notificationService.fetchMessagesAndNotify(
              'success',
              'appManagement.notification.delete.success.multiple'
            );

            this.alertService.fetchMessagesAndAlertWithBackendMessage(
              'success',
              'appManagement.alert.delete.title',
              res.message
            );
      }),
      catchError((error) => {
        ids.length === 1
          ? this.notificationService.fetchMessagesAndNotify(
              'danger',
              'appManagement.notification.delete.fail.single'
            )
          : this.notificationService.fetchMessagesAndNotify(
              'danger',
              'appManagement.notification.delete.fail.multiple'
            );
        this.errorHandling.handle(error);
        return throwError(() => error);
      })
    );
  }
}
