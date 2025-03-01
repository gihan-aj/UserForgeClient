import { AppDetails } from '../app-details.interface';
import { AppDetailsDialogType } from './app-details-dialog.type';

export interface AppDetailsDialogData {
  mode: AppDetailsDialogType;
  appDetails: AppDetails | undefined;
}
