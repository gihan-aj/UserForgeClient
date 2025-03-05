import { Injectable } from '@angular/core';
import { FetchDataSet } from '../../shared/interfaces/fetch-data-set.interface';
import { RoleDetails } from '../interfaces/role-details.interface';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';

import { PaginatedList } from '../../shared/interfaces/paginated-list.interface';
import { environment } from '../../../environments/environment';
import {
  APP_ID,
  PAGE,
  PAGE_SIZE,
  SEARCH_TERM,
  SORT_COLUMN,
  SORT_ORDER,
} from '../../shared/constants/query-params';
import { RoleFetchOptions } from '../interfaces/role-fetch-options.interface';

@Injectable({
  providedIn: 'root',
})
export class RoleManagementService implements FetchDataSet<RoleDetails> {
  private readonly baseUrl = `${environment.baseUrl}/roles`;

  constructor(private http: HttpClient) {}

  fetchDataSet(
    page: number,
    pageSize: number,
    sortColumn?: string,
    sortOrder?: string,
    searchTerm?: string
  ): Observable<PaginatedList<RoleDetails>> {
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

    return this.http.get<PaginatedList<RoleDetails>>(url, {
      params: queryParams,
    });
  }
}
