import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmatioDialog } from './confirmation-dialog.interface';
import { ConfirmationDialogComponent } from './confirmation-dialog.component';
import { Observable } from 'rxjs';
import { ConfirmationType } from './confirmation.type';
import { Messages } from '../../messages/messages.type';
import { MessagePath } from '../../messages/messsage-path.type';
import { MessageService } from '../../messages/message.service';

@Injectable({
  providedIn: 'root',
})
export class ConfirmationService {
  constructor(
    private readonly dialog: MatDialog,
    private messagService: MessageService
  ) {}

  confirm(
    type: ConfirmationType,
    title: string,
    message: string,
    action: string
  ): Observable<boolean> {
    const data: ConfirmatioDialog = {
      type: type,
      title: title,
      message: message,
      action: action,
    };

    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: data,
    });

    return dialogRef.afterClosed();
  }

  confirmWithMessageService(
    type: ConfirmationType,
    title: MessagePath<Messages>,
    message: MessagePath<Messages>,
    action: MessagePath<Messages>
  ): Observable<boolean> {
    const titleResolved = this.messagService.getMessage(title);
    const messageResolved = this.messagService.getMessage(message);
    const actionResolved = this.messagService.getMessage(action);

    const data: ConfirmatioDialog = {
      type: type,
      title: titleResolved,
      message: messageResolved,
      action: actionResolved,
    };

    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: data,
    });

    return dialogRef.afterClosed();
  }
}
