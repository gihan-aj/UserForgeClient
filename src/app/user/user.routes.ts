import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegistrationComponent } from './components/registration/registration.component';
import { ConfirmEmailComponent } from './components/confirm-email/confirm-email.component';
import { SendEmailComponent } from './components/send-email/send-email.component';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';
import { UserProfileComponent } from './components/user-profile/user-profile.component';
import { UserSettingsComponent } from './components/user-settings/user-settings.component';

export const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
    data: {
      breadcrumb: 'Login',
    },
  },
  {
    path: 'registration',
    component: RegistrationComponent,
    data: {
      breadcrumb: 'Registration',
    },
  },
  {
    path: 'confirm-email',
    component: ConfirmEmailComponent,
    data: {
      breadcrumb: 'Confirm Email',
    },
  },
  {
    path: 'send-email/:mode',
    component: SendEmailComponent,
    data: {
      breadcrumb: 'Send Email',
    },
  },
  {
    path: 'reset-password',
    component: ResetPasswordComponent,
    data: {
      breadcrumb: 'Reset Password',
    },
  },
  {
    path: 'user-profile',
    component: UserProfileComponent,
    data: {
      breadcrumb: 'User Profile',
    },
  },
  {
    path: 'user-settings',
    component: UserSettingsComponent,
    data: {
      breadcrumb: 'User Settings',
    },
  },
];
