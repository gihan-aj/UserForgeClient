import { Component, Inject, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_SNACK_BAR_DATA,
  MatSnackBarAction,
  MatSnackBarActions,
  MatSnackBarLabel,
  MatSnackBarRef,
} from '@angular/material/snack-bar';
import { Notification } from './notification.interface';
import { AlertType } from '../alert/alert-type.enum';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-notification',
  imports: [
    MatButtonModule,
    MatSnackBarLabel,
    MatSnackBarActions,
    MatSnackBarAction,
    MatIconModule,
  ],
  templateUrl: './notification.component.html',
  styleUrl: './notification.component.scss',
})
export class NotificationComponent {
  snackBarRef = inject(MatSnackBarRef);

  color: string;
  icon: string;

  constructor(@Inject(MAT_SNACK_BAR_DATA) public data: Notification) {
    if (data.type === AlertType.Success) {
      this.color = 'var(--mat-sys-on-primary)';
      this.icon = 'check_circle';
    } else if (data.type === AlertType.Info) {
      this.color = 'var(--mat-sys-on-tertiary)';
      this.icon = 'info';
    } else if (data.type === AlertType.Warning) {
      this.color = 'var(--mat-sys-on-secondary)';
      this.icon = 'warning';
    } else {
      this.color = 'var(--mat-sys-error-container)';
      this.icon = 'report';
    }
  }
}
