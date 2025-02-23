import {
  Component,
  effect,
  inject,
  OnDestroy,
  OnInit,
  signal,
} from '@angular/core';
import { Router } from '@angular/router';
import { last, Subscription } from 'rxjs';

import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';

import { AlertService } from '../../../shared/widgets/alert/alert.service';
import { AlertType } from '../../../shared/widgets/alert/alert-type.enum';
import { NotificationService } from '../../../shared/widgets/notification/notification.service';
import { UserService } from '../../services/user.service';
import { AuthService } from '../../../shared/services/auth.service';
import { ErrorHandlingService } from '../../../shared/error-handling/error-handling.service';
import { MessageService } from '../../../shared/messages/message.service';
import { User } from '../../models/user.model';
import { ABSOLUTE_ROUTES } from '../../../shared/constants/absolute-routes';
import { UserPageLoadingService } from '../../services/user-page-loading.service';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationService } from '../../../shared/widgets/confirmation-dialog/confirmation.service';
import { EditUserDetails } from './edit-user-profile-dialog/edit-user-details.interface';
import { EditUserProfileDialogComponent } from './edit-user-profile-dialog/edit-user-profile-dialog.component';
import { UpdateUserDetailsRequest } from '../../interfaces/update-user-details-request.interface';

@Component({
  selector: 'app-user-profile',
  imports: [MatButtonModule, MatDividerModule, MatListModule, MatIconModule],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.scss',
})
export class UserProfileComponent implements OnInit, OnDestroy {
  user = signal<User | null>(null);

  loading = signal(true);
  setLoading = effect(() => {
    this.loadingService.loadingStatus(this.loading());
  });

  userSubscription: Subscription;
  confirmEditSubscription: Subscription | undefined;
  dialogClosedSubscription: Subscription | undefined;

  loginUrl = ABSOLUTE_ROUTES.user.userLogin;

  constructor(
    private readonly dialog: MatDialog,
    private authService: AuthService,
    private userService: UserService,
    private router: Router,
    private alertService: AlertService,
    private notificationService: NotificationService,
    private errrorHandling: ErrorHandlingService,
    private msgService: MessageService,
    private loadingService: UserPageLoadingService,
    private confirmationService: ConfirmationService
  ) {
    this.userSubscription = this.authService.user$.subscribe((user) => {
      if (user) {
        this.user.set(user);
      } else {
        this.user.set(null);
      }
    });
  }

  ngOnInit(): void {
    this.userService.getUserDetails().subscribe({
      next: (user) => {
        console.log(user);

        if (!user) {
          this.notificationService.fetchMessagesAndNotify(
            'danger',
            'user.notification.userDetails.fail'
          );
        }

        this.loading.set(false);
      },
      error: (error) => {
        this.errrorHandling.handle(error);
        this.loading.set(false);
      },
    });
  }

  editProfile() {
    this.confirmEditSubscription = this.confirmationService
      .fetchMessagesAndConfirm(
        'warning',
        'user.confirmation.editUserDetails.title',
        'user.confirmation.editUserDetails.message',
        'user.confirmation.editUserDetails.action'
      )
      .subscribe((accepted) => {
        if (accepted) {
          this.openDialog();
        }
      });
  }

  private openDialog() {
    const data: EditUserDetails = {
      firstName: this.user()?.firstName!,
      lastName: this.user()?.lastName!,
      email: this.user()?.email!,
      phoneNumber: this.user()?.phoneNumber,
      dateOfBirth: this.user()?.dateOfBirth,
    };

    const dialogRef = this.dialog.open(EditUserProfileDialogComponent, {
      data: data,
    });

    this.dialogClosedSubscription = dialogRef
      .afterClosed()
      .subscribe((data: UpdateUserDetailsRequest | undefined) => {
        if (data) {
          this.loading.set(true);
          this.userService.updateUserDetails(data).subscribe({
            next: () => {
              const user = this.authService.getUser();
              if (user) {
                user.firstName = data.firstName;
                user.lastName = data.lastName;
                user.phoneNumber = data.phoneNumber;
                user.dateOfBirth = data.dateOfBirth;

                this.authService.setUser(user);
                this.loading.set(false);
              }

              this.alertService.fetchMessagesAndAlert(
                'success',
                'user.alert.userProfileUpdated.success.title',
                'user.alert.userProfileUpdated.success.message'
              );
            },
            error: (error) => {
              this.errrorHandling.handle(error);
              this.loading.set(false);
            },
          });
        }
      });
  }

  ngOnDestroy(): void {
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
    if (this.confirmEditSubscription) {
      this.confirmEditSubscription.unsubscribe();
    }
    if (this.dialogClosedSubscription) {
      this.dialogClosedSubscription.unsubscribe();
    }
  }
}
