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

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    TopBarComponent,
    SideNavComponent,
    FooterComponent,
    MatSidenavModule,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit, OnDestroy {
  sideNavService = inject(SideNavService);
  screenWidth = signal<number>(window.innerWidth);

  title = APP_TITLE;

  private userSubscription: Subscription;

  constructor(
    breadcrumbService: BreadcrumbService,
    private authService: AuthService
  ) {
    this.userSubscription = this.authService.user$.subscribe(() => {
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
      if (this.authService.getUser()) this.sideNavService.openSideNav();
      this.sideNavService.setSideNavMode(SideNavMode.Side);
    }
  }

  sideNavStatusChanged($event: boolean) {
    this.sideNavService.setSideNavOpenedStatus($event);
  }

  ngOnDestroy(): void {
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
  }
}
