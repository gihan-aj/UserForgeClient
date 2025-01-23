import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';

import { MessageService } from '../../shared/messages/message.service';
import { ThemeService } from '../../theme/theme.service';
import { AuthService } from '../../shared/services/auth.service';

import { User } from '../../user/models/user.model';
import { RouterLink } from '@angular/router';
import { ROUTE_STRINGS } from '../../shared/constants/route-strings';
import { SideNavService } from '../side-nav/side-nav.service';

@Component({
  selector: 'app-top-bar',
  imports: [
    CommonModule,
    RouterLink,
    MatIconModule,
    MatButtonModule,
    MatToolbarModule,
    MatMenuModule,
    MatTooltipModule,
  ],
  templateUrl: './top-bar.component.html',
  styleUrl: './top-bar.component.scss',
})
export class TopBarComponent {
  msgService = inject(MessageService);
  themeService = inject(ThemeService);
  sideNavService = inject(SideNavService);

  appName = this.msgService.getMessage('app.title');
  themeSelectToolTip = this.msgService.getMessage(
    'app.topBar.tooltip.themeSelect'
  );
  userMenuToolTip = this.msgService.getMessage('app.topBar.tooltip.user');
  sideMenuToggleToolTip = this.msgService.getMessage(
    'app.topBar.tooltip.sideMenu'
  );

  user: User | null = null;
  userRouterLinks = ROUTE_STRINGS.user;

  constructor(private authService: AuthService) {
    this.authService.user$.subscribe({
      next: (user) => {
        if (user) {
          this.user = user;
        } else {
          this.user = null;
        }
      },
    });
  }
}
