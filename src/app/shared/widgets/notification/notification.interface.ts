import { AlertType } from '../alert/alert-type.enum';

export interface Notification {
  type: AlertType;
  message: string;
}
