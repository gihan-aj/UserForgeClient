import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NotificationComponent } from './notification.component';
import { Notification } from './notification.interface';
import { NotificationType } from './notification.type';
import { MessagePath } from '../../messages/messsage-path.type';
import { Messages } from '../../messages/messages.type';
import { MessageService } from '../../messages/message.service';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  constructor(
    private snackBar: MatSnackBar,
    private messagService: MessageService
  ) {}

  private durationInSeconds = 5;

  notify(
    type: NotificationType,
    message: string,
    duration = this.durationInSeconds
  ): void {
    const notification: Notification = {
      type: type,
      message: message,
    };

    this.snackBar.openFromComponent(NotificationComponent, {
      duration: duration * 1000,
      horizontalPosition: 'end',
      verticalPosition: 'bottom',
      data: notification,
    });
  }

  fetchAndNotify(
    type: NotificationType,
    messagePath: MessagePath<Messages>,
    placeholdersForMessage: Record<string, string> = {},
    duration = this.durationInSeconds
  ): void {
    const message = this.messagService.getMessage(
      messagePath,
      placeholdersForMessage
    );

    const notification: Notification = {
      type: type,
      message: message,
    };

    this.snackBar.openFromComponent(NotificationComponent, {
      duration: duration * 1000,
      horizontalPosition: 'end',
      verticalPosition: 'bottom',
      data: notification,
    });
  }
}
