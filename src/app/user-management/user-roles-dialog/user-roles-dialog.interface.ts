import { DialogMode } from '../../shared/enums/dialog-mode.enum';
import { RoleAssignStatus } from '../interfaces/role-assign-status.interface';
import { UserDetails } from '../interfaces/user-details.interface';

export interface UserRolesDialog {
  mode: DialogMode;
  user?: UserDetails;
  userIds?: string[];
  userEmails?: string[];
  roles: RoleAssignStatus[];
}
