import { AlertType } from './alert.type';

export interface Alert {
  type: AlertType;
  title: string;
  message: string;
  details: string[];
}
