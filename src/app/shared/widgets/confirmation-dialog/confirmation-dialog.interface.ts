import { AlertType } from '../alert/alert-type.enum';

export interface ConfirmatioDialog {
  type: AlertType;
  title: string;
  message: string;
  action: string;
}
