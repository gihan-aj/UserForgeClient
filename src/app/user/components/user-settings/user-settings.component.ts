import { CommonModule, TitleCasePipe } from '@angular/common';
import { Component, inject, model, signal } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

import { SettingsService } from '../../../shared/settings/settings.service';
import { SETTING_KEYS } from '../../../shared/settings/setting-keys';
import { THEMES } from '../../../layout/top-bar/themes';
import { FormatTitlePipe } from '../../../shared/pipes/format-title.pipe';
import { LoadingContainerComponent } from '../../../shared/widgets/loading-container/loading-container.component';
import { ThemeService } from '../../../theme/theme.service';
import { UserService } from '../../services/user.service';
import { NotificationService } from '../../../shared/widgets/notification/notification.service';
import { ErrorHandlingService } from '../../../shared/error-handling/error-handling.service';
import { MessageService } from '../../../shared/messages/message.service';
import { AlertType } from '../../../shared/widgets/alert/alert-type.enum';

@Component({
  selector: 'app-user-settings',
  imports: [
    ReactiveFormsModule,
    FormsModule,
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    FormatTitlePipe,
    LoadingContainerComponent,
  ],
  templateUrl: './user-settings.component.html',
  styleUrl: './user-settings.component.scss',
})
export class UserSettingsComponent {
  settingsService = inject(SettingsService);
  themeService = inject(ThemeService);

  loading = signal(false);
  submitted = signal(false);

  settingsKeys = this.settingsService.settingKeys;
  themes = this.themeService.getThemes();
  pageSizes = this.settingsService.pageSizes;

  theme = model<string>();
  pageSize = model<number>();

  constructor(
    private userService: UserService,
    private notificatioService: NotificationService,
    private errorHandling: ErrorHandlingService,
    private msgService: MessageService
  ) {
    this.settingsService.settings$.subscribe((settings) => {
      this.theme.set(settings[this.settingsKeys.theme]);
      this.pageSize.set(settings[this.settingsKeys.pageSize]);
    });
  }

  onSave() {
    this.loading.set(true);

    const userSettings = this.settingsService.updateSettings({
      [this.settingsKeys.theme]: this.theme(),
      [this.settingsKeys.pageSize]: this.pageSize(),
    });

    console.log('before send: ', userSettings);
    this.userService.saveUserSettings(userSettings).subscribe({
      next: () => {
        this.notificatioService.fetchAndNotify(
          'success',
          'user.notification.saveUserSettings.success'
        );
        this.loading.set(false);
      },
      error: (error) => {
        this.errorHandling.handle(error);
        this.notificatioService.fetchAndNotify(
          'danger',
          'user.notification.saveUserSettings.fail'
        );
        this.loading.set(false);
      },
    });
  }
}
