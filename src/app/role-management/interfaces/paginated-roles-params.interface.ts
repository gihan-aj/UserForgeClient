import { PaginationParams } from '../../shared/interfaces/pagination-params.interface';

export interface PaginatedRolesParams extends PaginationParams {
  appId: number;
}
