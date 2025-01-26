import { inject, Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AlertType } from './alert-type.enum';
import { BackendError } from '../../interfaces/backend-error.interface';
import { Alert } from './alert.interface';
import { AlertComponent } from './alert.component';

@Injectable({
  providedIn: 'root',
})
export class AlertService {
  private readonly dialog = inject(MatDialog);

  constructor() {}

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
    dialogRef.addPanelClass('danger');
  }
}
