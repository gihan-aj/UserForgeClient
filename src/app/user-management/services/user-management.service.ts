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
} from '../../shared/constants/query-params';
import { FetchDataSet } from '../../shared/interfaces/fetch-data-set.interface';
import { BulkIdsRequest } from '../../shared/interfaces/bulk-ids-request.interface';
import { HttpSuccessResponse } from '../../shared/interfaces/http-success-response.interface';

@Injectable({
  providedIn: 'root',
})
export class UserManagementService implements FetchDataSet<UserDetails> {
  private readonly baseUrl = `${environment.baseUrl}/users`;

  constructor(private http: HttpClient) {}

  fetchDataSet(
    page: number,
    pageSize: number,
    sortColumn?: string,
    sortOrder?: string,
    searchTerm?: string
  ): Observable<PaginatedList<UserDetails>> {
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

    return this.http.get<PaginatedList<UserDetails>>(url, {
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
}
