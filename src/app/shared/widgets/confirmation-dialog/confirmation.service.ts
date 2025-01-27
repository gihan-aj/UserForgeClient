import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AlertType } from '../alert/alert-type.enum';
import { ConfirmatioDialog } from './confirmation-dialog.interface';
import { ConfirmationDialogComponent } from './confirmation-dialog.component';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ConfirmationService {
  constructor(private readonly dialog: MatDialog) {}

  confirm(
    type: AlertType,
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
}
