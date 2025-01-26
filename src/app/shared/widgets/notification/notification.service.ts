import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NotificationComponent } from './notification.component';
import { AlertType } from '../alert/alert-type.enum';
import { Notification } from './notification.interface';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  constructor(private snackBar: MatSnackBar) {}

  private durationInSeconds = 5;

  openSnackBar() {
    this.snackBar.openFromComponent(NotificationComponent, {
      duration: this.durationInSeconds * 1000,
    });
  }

  notify(
    type: AlertType,
    message: string,
    duration = this.durationInSeconds
  ): void {
    const notification: Notification = {
      type: type,
      message: message,
    };

    this.snackBar.openFromComponent(NotificationComponent, {
      duration: this.durationInSeconds * 1000,
      horizontalPosition: 'end',
      verticalPosition: 'bottom',
      data: notification,
    });
  }
}
