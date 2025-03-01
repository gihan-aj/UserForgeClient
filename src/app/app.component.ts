import {
  Component,
  HostListener,
  inject,
  OnDestroy,
  OnInit,
  signal,
} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Subscription } from 'rxjs';

import { MatSidenavModule } from '@angular/material/sidenav';

import { TopBarComponent } from './layout/top-bar/top-bar.component';
import { SideNavComponent } from './layout/side-nav/side-nav.component';
import { FooterComponent } from './layout/footer/footer.component';

import { SideNavService } from './layout/side-nav/side-nav.service';
import { SideNavMode } from './layout/side-nav/side-nav-mode.enum';
import { LARGE_SCREEN_LOWER_LIMIT } from './shared/constants/screen-size';
import { BreadcrumbService } from './shared/breadcrumb/breadcrumb.service';
import { AuthService } from './shared/services/auth.service';
import { APP_TITLE } from './shared/constants/app-title';
import { PermissionService } from './shared/services/permission.service';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { LoadingService } from './shared/services/loading.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [
    CommonModule,
    RouterOutlet,
    TopBarComponent,
    SideNavComponent,
    FooterComponent,
    MatSidenavModule,
    MatProgressBarModule,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit, OnDestroy {
  sideNavService = inject(SideNavService);
  loadingService = inject(LoadingService);
  screenWidth = signal<number>(window.innerWidth);

  title = APP_TITLE;

  // private userSubscription: Subscription;
  private permissionsSubscription: Subscription;

  constructor(
    breadcrumbService: BreadcrumbService,
    private authService: AuthService,
    private permissionsService: PermissionService
  ) {
    // this.userSubscription = this.authService.user$.subscribe(() => {
    //   this.setSideNav();
    // });

    this.permissionsSubscription =
      this.permissionsService.permissions$.subscribe(() => {
        this.setSideNav();
      });
  }

  ngOnInit(): void {
    this.setSideNav();
  }

  @HostListener('window:resize')
  onResize() {
    this.screenWidth.set(window.innerWidth);
    this.setSideNav();
  }

  private setSideNav(): void {
    if (this.screenWidth() < LARGE_SCREEN_LOWER_LIMIT) {
      this.sideNavService.closeSideNav();
      this.sideNavService.setSideNavMode(SideNavMode.Over);
    } else {
      if (this.permissionsService.userHasPermissions())
        this.sideNavService.openSideNav();
      this.sideNavService.setSideNavMode(SideNavMode.Side);
    }
  }

  sideNavStatusChanged($event: boolean) {
    this.sideNavService.setSideNavOpenedStatus($event);
  }

  ngOnDestroy(): void {
    // if (this.userSubscription) {
    //   this.userSubscription.unsubscribe();
    // }
    if (this.permissionsSubscription) {
      this.permissionsSubscription.unsubscribe();
    }
  }
}
