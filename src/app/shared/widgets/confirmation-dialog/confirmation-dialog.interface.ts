import { ConfirmationType } from './confirmation.type';

export interface ConfirmatioDialog {
  type: ConfirmationType;
  title: string;
  message: string;
  action: string;
}
