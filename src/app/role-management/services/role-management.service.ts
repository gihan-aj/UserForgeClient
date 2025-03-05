import { Injectable } from '@angular/core';
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
import { FetchPaginatedData } from '../../shared/interfaces/fetch-paginated-data.interface';
import { PaginatedRolesParams } from '../interfaces/paginated-roles-params.interface';

@Injectable({
  providedIn: 'root',
})
export class RoleManagementService implements FetchPaginatedData<RoleDetails, PaginatedRolesParams> {
  private readonly baseUrl = `${environment.baseUrl}/roles`;

  constructor(private http: HttpClient) {}

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
}
