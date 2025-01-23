import { Injectable } from '@angular/core';
import { AppTheme } from '../../theme/app-theme.enum';
import { UserSetting } from './user-setting.interface';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SettingsService {
  private defaultSettings: { [key: string]: any } = {
    theme: AppTheme.System,
    pageSize: 10,
  };

  private settingsSubject = new BehaviorSubject<{ [key: string]: any }>({
    ...this.defaultSettings,
  });
  settings$ = this.settingsSubject.asObservable();

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

  updateSetting(key: string, value: any): void {
    const currentSettings = this.settingsSubject.getValue();
    currentSettings[key] = value;
    this.settingsSubject.next(currentSettings);
  }

  getSettingsSnapshot(): { [key: string]: any } {
    return this.settingsSubject.getValue();
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
