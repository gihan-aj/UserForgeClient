import { inject, Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { BackendError } from '../../interfaces/backend-error.interface';
import { Alert } from './alert.interface';
import { AlertComponent } from './alert.component';
import { AlertType } from './alert.type';
import { MessagePath } from '../../messages/messsage-path.type';
import { Messages } from '../../messages/messages.type';
import { MessageService } from '../../messages/message.service';

@Injectable({
  providedIn: 'root',
})
export class AlertService {
  private readonly dialog = inject(MatDialog);

  constructor(private messageService: MessageService) {}

  showAlert(
    type: AlertType,
    title: string,
    message: string,
    description: BackendError[] = []
  ): void {
    let errors: string[] = [];
    if (description !== null && description.length > 0) {
      errors = description.map((e) => e.description);
    }

    const data: Alert = {
      type: type,
      title: title,
      message: message,
      details: errors,
    };

    const dialogRef = this.dialog.open(AlertComponent, { data: data });
    // dialogRef.addPanelClass('danger');
  }

  showAlertWithMessages(
    type: AlertType,
    title: MessagePath<Messages>,
    message: MessagePath<Messages>,
    placeholdersForMessage: Record<string, string> = {}
  ) {
    const data: Alert = {
      type: type,
      title: this.messageService.getMessage(title),
      message: this.messageService.getMessage(message, placeholdersForMessage),
      details: [],
    };

    const dialogRef = this.dialog.open(AlertComponent, { data: data });
  }

  showAlertWithBackendMessage(
    type: AlertType,
    title: MessagePath<Messages>,
    message: string
  ) {
    const data: Alert = {
      type: type,
      title: this.messageService.getMessage(title),
      message: message,
      details: [],
    };

    const dialogRef = this.dialog.open(AlertComponent, { data: data });
  }
}
