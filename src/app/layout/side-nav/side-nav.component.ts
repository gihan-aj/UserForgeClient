import { Component, OnDestroy, OnInit } from '@angular/core';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';

import { SideMenuItem } from './side-menu-item.interface';
import { MatToolbarModule } from '@angular/material/toolbar';
import { SideNavService } from './side-nav.service';
import { SideNavMode } from './side-nav-mode.enum';
import { SIDE_MENU } from './side-menu';
import { ABSOLUTE_ROUTES } from '../../shared/constants/absolute-routes';

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
export class SideNavComponent implements OnInit, OnDestroy {
  sideMenu = SIDE_MENU;
  routes = ABSOLUTE_ROUTES;

  menuItems: SideMenuItem[] = [
    {
      name: this.sideMenu.home,
      icon: 'home',
      route: this.routes.home,
      isActive: false,
    },
    {
      name: this.sideMenu.dashboard,
      icon: 'dashboard',
      route: this.routes.dashboard,
      isActive: false,
    },
    {
      name: this.sideMenu.userManagement,
      icon: 'groups',
      route: this.routes.userManagement.base,
      isActive: false,
    },
    {
      name: this.sideMenu.softwarePackages,
      icon: 'app_shortcut',
      route: this.routes.softwarePackages.base,
      isActive: false,
    },
    {
      name: this.sideMenu.permissionManagement,
      icon: 'admin_panel_settings',
      route: this.routes.permissionManagement.base,
      isActive: false,
    },
    {
      name: this.sideMenu.auditLogs,
      icon: 'summarize',
      route: this.routes.auditLogs.base,
      isActive: false,
    },
    {
      name: this.sideMenu.ssoSettings,
      icon: 'manufacturing',
      route: this.routes.ssoSettings.base,
      isActive: false,
    },
    {
      name: this.sideMenu.intergrations,
      icon: 'api',
      route: this.routes.intergrations.base,
      isActive: false,
    },
    {
      name: this.sideMenu.support,
      icon: 'help',
      route: this.routes.support.base,
      isActive: false,
    },
    {
      name: this.sideMenu.settings,
      icon: 'settings',
      route: this.routes.settings.base,
      isActive: false,
    },
  ];

  routerSubscription: Subscription;

  constructor(private router: Router, private sideNav: SideNavService) {
    this.routerSubscription = this.router.events.subscribe((event) => {
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

  ngOnInit(): void {
    // this.routerSubscription = this.router.events.subscribe((event) => {
    //   if (event instanceof NavigationEnd) {
    //     this.updateActiveLink(event.urlAfterRedirects);
    //     if (
    //       this.sideNav.sideNavModeStaus() === SideNavMode.Over &&
    //       this.sideNav.sideNavStatus() === true
    //     )
    //       this.sideNav.closeSideNav();
    //   }
    // });
  }

  updateActiveLink(route: string): void {
    this.menuItems.forEach((menuItem) => {
      menuItem.isActive = menuItem.route === route;
    });
  }

  ngOnDestroy(): void {
    this.routerSubscription.unsubscribe();
  }
}
