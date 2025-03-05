import { Observable } from 'rxjs';
import { PaginatedList } from './paginated-list.interface';
import { PaginationParams } from './pagination-params.interface';

export interface FetchPaginatedData<T, U = PaginationParams> {
  fetchDataSet(params: U): Observable<PaginatedList<T>>;
}
