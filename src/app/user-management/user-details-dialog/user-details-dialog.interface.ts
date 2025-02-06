import { DialogMode } from '../../shared/enums/dialog-mode.enum';
import { UserDetails } from '../interfaces/user-details.interface';

export interface UserDetailsDialog {
  mode: DialogMode;
  title: string;
  userDetails?: UserDetails;
}
