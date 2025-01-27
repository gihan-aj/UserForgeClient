import {
  computed,
  effect,
  Injectable,
  signal,
  WritableSignal,
} from '@angular/core';

import { AppTheme } from './app-theme.enum';
import { Theme } from './theme.interface';
import { SettingsService } from '../shared/settings/settings.service';
import { Setting } from '../shared/settings/setting.enum';
import { APP_THEMES } from './app-themes';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  appTheme: WritableSignal<AppTheme> = signal<AppTheme>(AppTheme.System);
  private themeNames = APP_THEMES;

  themes: Theme[] = [
    {
      label: AppTheme.Light,
      name: this.themeNames.light,
      icon: 'light_mode',
    },
    {
      label: AppTheme.Dark,
      name: this.themeNames.dark,
      icon: 'dark_mode',
    },
    {
      label: AppTheme.System,
      name: this.themeNames.system,
      icon: 'desktop_windows',
    },
  ];

  selectedTheme = computed(() => {
    return this.themes.find((theme) => theme.label === this.appTheme());
  });

  constructor(private settings: SettingsService) {
    this.settings.settings$.subscribe({
      next: (settings) => {
        this.appTheme.set(settings[Setting.Theme]);
      },
    });
  }

  getThemes(): Theme[] {
    return this.themes;
  }

  setTheme(name: AppTheme) {
    this.appTheme.set(name);
  }

  setSystemTheme = effect(() => {
    const appTheme = this.appTheme();
    const colorScheme = appTheme === AppTheme.System ? 'light dark' : appTheme;
    document.body.style.colorScheme = colorScheme;
  });
}
