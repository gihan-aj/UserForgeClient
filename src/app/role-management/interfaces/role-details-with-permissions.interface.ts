import { PermissionDetails } from '../../permissions/interfaces/permission-details.interface';
import { RoleDetails } from './role-details.interface';

export interface RoleDetailsWithPermissions extends RoleDetails {
  permissions: PermissionDetails[];
}
