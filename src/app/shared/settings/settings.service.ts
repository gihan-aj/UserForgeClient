import { inject, Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { AppTheme } from '../../theme/app-theme.enum';
import { UserSetting } from './user-setting.interface';
import { AuthService } from '../services/auth.service';
import { DATE_FORMAT } from './date-format';
import { TIME_FORMAT } from './time-format';
import { PAGE_SIZES } from './page-sizes';
import { SETTING_KEYS } from './setting-keys';

@Injectable({
  providedIn: 'root',
})
export class SettingsService {
  settingKeys = SETTING_KEYS;

  // dateFormats = DATE_FORMAT;
  // timeFormats = TIME_FORMAT;
  pageSizes = PAGE_SIZES;

  defaultSettings: { [key: string]: any } = {
    [this.settingKeys.theme]: AppTheme.System,
    [this.settingKeys.pageSize]: this.pageSizes[1],
  };

  private settingsSubject = new BehaviorSubject<{ [key: string]: any }>({
    ...this.defaultSettings,
  });
  settings$ = this.settingsSubject.asObservable();

  constructor(private authService: AuthService) {
    this.authService.user$.subscribe((user) => {
      if (user) {
        if (user.userSettings && user.userSettings.length > 0)
          this.loadSettings(user.userSettings);
      } else {
        this.settingsSubject.next({ ...this.defaultSettings });
      }
    });
  }

  loadSettings(userSettings: UserSetting[]): void {
    const mergedSettings = { ...this.defaultSettings };

    userSettings.forEach((setting) => {
      mergedSettings[setting.key] = this.parseValue(
        setting.value,
        setting.dataType
      );
    });

    this.settingsSubject.next(mergedSettings);
  }

  // updateSetting(key: string, value: any): void {
  //   const currentSettings = this.settingsSubject.getValue();
  //   currentSettings[key] = value;
  //   this.settingsSubject.next(currentSettings);
  // }

  updateSettings(settings: { [key: string]: any }): UserSetting[] {
    const currentSettings = this.settingsSubject.getValue();

    currentSettings[this.settingKeys.theme] = settings[this.settingKeys.theme];
    currentSettings[this.settingKeys.pageSize] =
      settings[this.settingKeys.pageSize];

    this.settingsSubject.next(currentSettings);

    return this.persistSettingsInUser(settings);
  }

  getSettingsSnapshot(): { [key: string]: any } {
    return this.settingsSubject.getValue();
  }

  private persistSettingsInUser(settings: {
    [key: string]: any;
  }): UserSetting[] {
    const user = this.authService.getUser();
    if (user) {
      const existingUserSettings: UserSetting[] = user.userSettings;

      // theme
      const themeSetting = existingUserSettings.find(
        (s) => s.key === this.settingKeys.theme
      );
      if (themeSetting) {
        themeSetting.value = settings[this.settingKeys.theme];
      } else {
        const newSetting: UserSetting = {
          key: this.settingKeys.theme,
          value: settings[this.settingKeys.theme],
          dataType: 'string',
        };
        existingUserSettings.push(newSetting);
      }

      // pageSize
      const pageSizeSetting = existingUserSettings.find(
        (s) => s.key === this.settingKeys.pageSize
      );
      if (pageSizeSetting) {
        pageSizeSetting.value = settings[this.settingKeys.pageSize].toString();
      } else {
        const newSetting: UserSetting = {
          key: this.settingKeys.pageSize,
          value: settings[this.settingKeys.pageSize].toString(),
          dataType: 'number',
        };
        existingUserSettings.push(newSetting);
      }

      return user.userSettings;
    }

    return [];
  }

  private parseValue(value: any, dataType: string): any {
    switch (dataType) {
      case 'number':
        return Number(value);
      case 'boolean':
        return value === 'true';
      case 'string':
        return value;
      default:
        if (dataType === 'AppTheme') {
          const theme = Object.values(AppTheme).find((v) => v === value);
          return theme || AppTheme.System;
        }
        return value;
    }
  }
}
