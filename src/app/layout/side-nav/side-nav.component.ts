import { Component, inject, OnInit } from '@angular/core';
import { NavigationEnd, Router, RouterLink } from '@angular/router';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { SideMenuItem } from './side-menu-item.interface';

import { MessageService } from '../../shared/messages/message.service';
import { ROUTE_STRINGS } from '../../shared/constants/route-strings';
import { MatToolbarModule } from '@angular/material/toolbar';
import { SideNavService } from './side-nav.service';
import { SideNavMode } from './side-nav-mode.enum';

@Component({
  selector: 'app-side-nav',
  imports: [
    RouterLink,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    MatToolbarModule,
  ],
  templateUrl: './side-nav.component.html',
  styleUrl: './side-nav.component.scss',
})
export class SideNavComponent implements OnInit {
  msgService = inject(MessageService);

  menuItems: SideMenuItem[] = [
    {
      name: this.msgService.getMessage('app.menu.sideMenu.dashboard'),
      icon: 'dashboard',
      route: ROUTE_STRINGS.dashboard,
      isActive: false,
    },
    {
      name: this.msgService.getMessage('app.menu.sideMenu.userManagement'),
      icon: 'groups',
      route: ROUTE_STRINGS.userManagement.base,
      isActive: false,
    },
    {
      name: this.msgService.getMessage('app.menu.sideMenu.softwarePackages'),
      icon: 'app_shortcut',
      route: ROUTE_STRINGS.softwarePackages.base,
      isActive: false,
    },
    {
      name: this.msgService.getMessage(
        'app.menu.sideMenu.permissionManagement'
      ),
      icon: 'admin_panel_settings',
      route: ROUTE_STRINGS.permissionManagement.base,
      isActive: false,
    },
    {
      name: this.msgService.getMessage('app.menu.sideMenu.auditLogs'),
      icon: 'summarize',
      route: ROUTE_STRINGS.auditLogs.base,
      isActive: false,
    },
    {
      name: this.msgService.getMessage('app.menu.sideMenu.ssoSettings'),
      icon: 'manufacturing',
      route: ROUTE_STRINGS.ssoSettings.base,
      isActive: false,
    },
    {
      name: this.msgService.getMessage('app.menu.sideMenu.intergrations'),
      icon: 'api',
      route: ROUTE_STRINGS.intergrations.base,
      isActive: false,
    },
    {
      name: this.msgService.getMessage('app.menu.sideMenu.support'),
      icon: 'help',
      route: ROUTE_STRINGS.support.base,
      isActive: false,
    },
    {
      name: this.msgService.getMessage('app.menu.sideMenu.settings'),
      icon: 'settings',
      route: ROUTE_STRINGS.settings.base,
      isActive: false,
    },
  ];

  constructor(private router: Router, private sideNav: SideNavService) {}

  ngOnInit(): void {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.updateActiveLink(event.urlAfterRedirects);
        if (
          this.sideNav.sideNavModeStaus() === SideNavMode.Over &&
          this.sideNav.sideNavStatus() === true
        )
          this.sideNav.closeSideNav();
      }
    });
  }

  updateActiveLink(route: string): void {
    this.menuItems.forEach((menuItem) => {
      menuItem.isActive = menuItem.route === route;
    });
  }
}
