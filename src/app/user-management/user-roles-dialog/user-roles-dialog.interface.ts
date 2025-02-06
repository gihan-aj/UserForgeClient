import { DialogMode } from '../../shared/enums/dialog-mode.enum';
import { UserDetails } from '../interfaces/user-details.interface';

export interface UserRolesDialog {
  mode: DialogMode;
  title: string;
  user: UserDetails;
  roles: {
    roleName: string;
    isAssigned: boolean;
  }[];
}
