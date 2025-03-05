import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

import { UserDetails } from '../interfaces/user-details.interface';
import { PaginatedList } from '../../shared/interfaces/paginated-list.interface';
import {
  PAGE,
  PAGE_SIZE,
  SEARCH_TERM,
  SORT_COLUMN,
  SORT_ORDER,
  USER_ID,
} from '../../shared/constants/query-params';
import { FetchDataSet } from '../../shared/interfaces/fetch-data-set.interface';
import { BulkIdsRequest } from '../../shared/interfaces/bulk-ids-request.interface';
import { HttpSuccessResponse } from '../../shared/interfaces/http-success-response.interface';
import { AssignRolesRequest } from '../interfaces/assign-roles.interface';
import { BulkAssignRolesRequest } from '../interfaces/bulk-assign-roles-request.interface';
import { FetchPaginatedData } from '../../shared/interfaces/fetch-paginated-data.interface';
import { PaginationParams } from '../../shared/interfaces/pagination-params.interface';

@Injectable({
  providedIn: 'root',
})
export class UserManagementService implements FetchPaginatedData<UserDetails> {
  private readonly baseUrl = `${environment.baseUrl}/users`;

  constructor(private http: HttpClient) {}

  fetchDataSet(
    params: PaginationParams
  ): Observable<PaginatedList<UserDetails>> {
    const url = this.baseUrl;

    let queryParams = new HttpParams();
    if (params.searchTerm) {
      queryParams = queryParams.append(SEARCH_TERM, params.searchTerm);
    }
    if (params.sortColumn) {
      queryParams = queryParams.append(SORT_COLUMN, params.sortColumn);
    }
    if (params.sortOrder) {
      queryParams = queryParams.append(SORT_ORDER, params.sortOrder);
    }
    queryParams = queryParams.append(PAGE, params.page.toString());
    queryParams = queryParams.append(PAGE_SIZE, params.pageSize.toString());

    return this.http.get<PaginatedList<UserDetails>>(url, {
      params: queryParams,
    });
  }

  getRoleNames(): Observable<string[]> {
    const url = `${environment.baseUrl}/roles/role-names`;

    return this.http.get<string[]>(url);
  }

  getUserRoles(userId: string): Observable<string[]> {
    const url = `${this.baseUrl}/user-roles`;

    let queryParams = new HttpParams();
    queryParams = queryParams.append(USER_ID, userId);

    return this.http.get<string[]>(url, {
      params: queryParams,
    });
  }

  activate(ids: string[]) {
    const url = `${this.baseUrl}/activate`;
    const body: BulkIdsRequest<string> = {
      ids: ids,
    };

    return this.http.put<HttpSuccessResponse>(url, body);
  }

  deactivate(ids: string[]) {
    const url = `${this.baseUrl}/deactivate`;
    const body: BulkIdsRequest<string> = {
      ids: ids,
    };

    return this.http.put<HttpSuccessResponse>(url, body);
  }

  delete(ids: string[]) {
    const url = `${this.baseUrl}/delete`;
    const body: BulkIdsRequest<string> = {
      ids: ids,
    };

    return this.http.put<HttpSuccessResponse>(url, body);
  }

  assignRoles(request: AssignRolesRequest): Observable<HttpSuccessResponse> {
    const url = `${this.baseUrl}/assign-roles`;

    return this.http.put<HttpSuccessResponse>(url, request);
  }

  bulkAssignRoles(request: BulkAssignRolesRequest): Observable<void> {
    const url = `${this.baseUrl}/bulk-assign-roles`;

    return this.http.put<void>(url, request);
  }
}
