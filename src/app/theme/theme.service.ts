import {
  computed,
  effect,
  inject,
  Injectable,
  signal,
  WritableSignal,
} from '@angular/core';
import { AppTheme } from './app-theme.enum';
import { Theme } from './theme.interface';
import { MessageService } from '../shared/messages/message.service';
import { SettingsService } from '../shared/settings/settings.service';
import { Setting } from '../shared/settings/setting.enum';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private msgService = inject(MessageService);

  appTheme: WritableSignal<AppTheme> = signal<AppTheme>(AppTheme.System);

  themes: Theme[] = [
    {
      label: AppTheme.Light,
      name: this.msgService.getMessage('app.menu.themeSelect.light'),
      icon: 'light_mode',
    },
    {
      label: AppTheme.Dark,
      name: this.msgService.getMessage('app.menu.themeSelect.dark'),
      icon: 'dark_mode',
    },
    {
      label: AppTheme.System,
      name: this.msgService.getMessage('app.menu.themeSelect.system'),
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
