import { Observable } from 'rxjs';
import { PaginatedList } from './paginated-list.interface';

export interface FetchDataSet<T> {
  fetchDataSet(
    page: number,
    pageSize: number,
    sortColumn?: string,
    sortOrder?: string,
    searchTerm?: string
  ): Observable<PaginatedList<T>>;
}
