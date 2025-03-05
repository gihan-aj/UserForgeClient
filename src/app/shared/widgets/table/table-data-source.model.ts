import { CollectionViewer, DataSource } from '@angular/cdk/collections';
import { BehaviorSubject, Observable } from 'rxjs';

import { PaginatedList } from '../../interfaces/paginated-list.interface';
import { ErrorHandlingService } from '../../error-handling/error-handling.service';
import { PaginationParams } from '../../interfaces/pagination-params.interface';

export class TableDataSource<T, U = PaginationParams> implements DataSource<T> {
  private dataSubject = new BehaviorSubject<T[]>([]);
  dataStream$ = this.dataSubject.asObservable();

  private loadingSubject = new BehaviorSubject<boolean>(false);
  loading$ = this.loadingSubject.asObservable();

  page: number | null = null;
  pageSize: number | null = null;
  items: T[] = [];
  itemCount: number | null = null;
  totalCount: number = 0;

  constructor(
    private dataService: {
      fetchDataSet: (params: U) => Observable<PaginatedList<T>>;
    },
    private errorHandling: ErrorHandlingService
  ) {}

  connect(collectionViewer: CollectionViewer): Observable<readonly T[]> {
    return this.dataStream$;
  }

  disconnect(collectionViewer: CollectionViewer): void {
    this.dataSubject.complete();
    this.loadingSubject.complete();
  }

  loadData(params: U): void {
    this.loadingSubject.next(true);

    this.dataService.fetchDataSet(params).subscribe({
      next: (response) => {
        this.page = response.page;
        this.pageSize = response.pageSize;
        this.items = response.items;
        this.itemCount = response.items.length;
        this.totalCount = response.totalCount;
        this.dataSubject.next(response.items);
      },
      error: (error) => {
        this.errorHandling.handle(error);
        this.totalCount = 0;
      },
      complete: () => {
        this.loadingSubject.next(false);
      },
    });
  }
}
