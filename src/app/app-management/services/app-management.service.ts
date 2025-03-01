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

@Injectable({
  providedIn: 'root',
})
export class AppManagementService implements FetchDataSet<AppDetails> {
  private readonly baseUrl = `${environment.baseUrl}/apps`;

  constructor(
    private http: HttpClient,
    private notificationService: NotificationService,
    private errorHandling: ErrorHandlingService
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
}
