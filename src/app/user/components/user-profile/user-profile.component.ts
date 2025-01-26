import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { AlertService } from '../../../shared/widgets/alert/alert.service';
import { AlertType } from '../../../shared/widgets/alert/alert-type.enum';

@Component({
  selector: 'app-user-profile',
  imports: [MatButtonModule],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.scss',
})
export class UserProfileComponent {
  constructor(private alertService: AlertService) {}
  show() {
    this.alertService.showAlert(
      AlertType.Success,
      'Success',
      'This will delete all elements that are currently on this page and cannot be undone.'
    );
  }
}
