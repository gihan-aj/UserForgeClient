import {
  computed,
  effect,
  inject,
  Injectable,
  Signal,
  signal,
  WritableSignal,
} from '@angular/core';
import { AppTheme } from './app-theme.enum';
import { Theme } from './theme.interface';
import { MessageService } from '../shared/messages/message.service';

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
