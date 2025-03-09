import { AppDetails } from '../../../app-management/app-details.interface';
import { RoleDetails } from '../../interfaces/role-details.interface';
import { RoleDetailsDialogType } from './role-details-dialog.type';

export interface RoleDetailsDialogData {
  mode: RoleDetailsDialogType;
  app: AppDetails;
  roleDetails: RoleDetails | undefined;
}
