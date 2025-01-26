import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { AlertService } from '../../../shared/widgets/alert/alert.service';
import { AlertType } from '../../../shared/widgets/alert/alert-type.enum';
import { NotificationService } from '../../../shared/widgets/notification/notification.service';

@Component({
  selector: 'app-user-profile',
  imports: [MatButtonModule],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.scss',
})
export class UserProfileComponent {
  constructor(
    private alertService: AlertService,
    private notification: NotificationService
  ) {}
  showError() {
    this.alertService.showAlert(
      AlertType.Danger,
      'Error',
      'This will delete all elements that are currently on this page and cannot be undone.'
    );

    this.notification.notify(AlertType.Danger, 'Notofication published.');
  }
  showWarning() {
    this.alertService.showAlert(
      AlertType.Warning,
      'Warning',
      'This will delete all elements that are currently on this page and cannot be undone.'
    );

    this.notification.notify(AlertType.Warning, 'Notofication published.');
  }
  showInfo() {
    this.alertService.showAlert(
      AlertType.Info,
      'Information',
      'This will delete all elements that are currently on this page and cannot be undone.'
    );

    this.notification.notify(AlertType.Info, 'Notofication published.');
  }
  showSuccess() {
    this.alertService.showAlert(
      AlertType.Success,
      'Success',
      'This will delete all elements that are currently on this page and cannot be undone.'
    );

    this.notification.notify(AlertType.Success, 'Notofication published.');
  }
}
