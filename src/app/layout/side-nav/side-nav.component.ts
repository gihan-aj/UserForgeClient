import { Component, inject, OnDestroy, OnInit } from '@angular/core';
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
import { PermissionService } from '../../shared/services/permission.service';
import { CommonModule } from '@angular/common';
import { APP_TITLE } from '../../shared/constants/app-title';

@Component({
  selector: 'app-side-nav',
  imports: [
    RouterLink,
    CommonModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    MatToolbarModule,
  ],
  templateUrl: './side-nav.component.html',
  styleUrl: './side-nav.component.scss',
})
export class SideNavComponent implements OnInit, OnDestroy {
  permissionsService = inject(PermissionService);

  appName = APP_TITLE;
  sideMenu = SIDE_MENU;
  routes = ABSOLUTE_ROUTES;

  menuItems: SideMenuItem[] = [
    {
      name: this.sideMenu.home,
      icon: 'home',
      route: this.routes.home,
      permissionPrefix: 'home.',
      isActive: false,
    },
    {
      name: this.sideMenu.dashboard,
      icon: 'dashboard',
      route: this.routes.dashboard,
      permissionPrefix: 'dashboard.',
      isActive: false,
    },
    {
      name: this.sideMenu.appPortal,
      icon: 'fence',
      route: this.routes.appPortal.base,
      permissionPrefix: 'app-portal.',
      isActive: false,
    },
    {
      name: this.sideMenu.userManagement,
      icon: 'groups',
      route: this.routes.userManagement.base,
      permissionPrefix: 'users.',
      isActive: false,
    },
    {
      name: this.sideMenu.roleManagement,
      icon: 'category_search',
      route: this.routes.roleManagement.base,
      permissionPrefix: 'roles.',
      isActive: false,
    },
    {
      name: this.sideMenu.permissions,
      icon: 'admin_panel_settings',
      route: this.routes.permissions.base,
      permissionPrefix: 'permissions.',
      isActive: false,
    },
    {
      name: this.sideMenu.appManagement,
      icon: 'app_registration',
      route: this.routes.appManagement.base,
      permissionPrefix: 'apps.',
      isActive: false,
    },
    {
      name: this.sideMenu.auditLogs,
      icon: 'summarize',
      route: this.routes.auditLogs.base,
      permissionPrefix: 'audit-logs.',
      isActive: false,
    },
    {
      name: this.sideMenu.support,
      icon: 'help',
      route: this.routes.support.base,
      permissionPrefix: 'support.',
      isActive: false,
    },
    {
      name: this.sideMenu.settings,
      icon: 'settings',
      route: this.routes.settings.base,
      permissionPrefix: 'settings.',
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
