import { Injectable } from '@angular/core';

import { HTTP_ERROR_MESSAGES } from './http-error-messages';
import { UNKNOWN_ERROR } from './unknown-error';
import { AlertService } from '../widgets/alert/alert.service';

@Injectable({
  providedIn: 'root',
})
export class ErrorHandlingService {
  private httpErrorMessages = HTTP_ERROR_MESSAGES;
  private unknownError = UNKNOWN_ERROR;

  constructor(private alertService: AlertService) {}

  handle(error: any): void {
    if (error?.error?.title) {
      this.alertService.showAlert(
        'danger',
        error.error.title,
        `${error.error.detail} (${error.status})`,
        error.error.errors!
      );
    } else {
      const httpError = this.handleHttpError(error);

      const title = httpError.title;
      const message = httpError.message;

      this.alertService.showAlert(
        'danger',
        title,
        `${message} (${error.status})`
      );
    }
  }

  private handleHttpError(error: { status: number }): {
    title: string;
    message: string;
  } {
    return this.httpErrorMessages[error.status] || this.unknownError;
  }
}
