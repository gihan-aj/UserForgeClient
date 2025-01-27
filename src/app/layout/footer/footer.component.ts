import { Component, signal, WritableSignal } from '@angular/core';

import { APP_TITLE } from '../../shared/constants/app-title';
import { FOOTER_TEXT } from './footer-text';

@Component({
  selector: 'app-footer',
  imports: [],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss',
})
export class FooterComponent {
  appTitle = APP_TITLE;
  footerText = FOOTER_TEXT;

  year: WritableSignal<number> = signal(0);

  constructor() {
    this.year.set(new Date().getFullYear());
  }
}
