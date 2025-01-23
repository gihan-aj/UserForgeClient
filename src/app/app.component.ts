import {
  Component,
  HostListener,
  inject,
  model,
  OnInit,
  signal,
} from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { TopBarComponent } from './layout/top-bar/top-bar.component';
import { SideNavComponent } from './layout/side-nav/side-nav.component';
import { FooterComponent } from './layout/footer/footer.component';

import { MatSidenavModule } from '@angular/material/sidenav';
import { SideNavService } from './layout/side-nav/side-nav.service';
import { SideNavMode } from './layout/side-nav/side-nav-mode.enum';
import { LARGE_SCREEN_LOWER_LIMIT } from './shared/constants/screen-size';

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
export class AppComponent implements OnInit {
  sideNavService = inject(SideNavService);
  screenWidth = signal<number>(window.innerWidth);

  title = 'user-forge-client';

  ngOnInit(): void {
    this.setSideNav();
  }

  @HostListener('window:resize')
  onResize() {
    this.screenWidth.set(window.innerWidth);
    this.setSideNav();
  }

  setSideNav(): void {
    if (this.screenWidth() < LARGE_SCREEN_LOWER_LIMIT) {
      this.sideNavService.closeSideNav();
      this.sideNavService.setSideNavMode(SideNavMode.Over);
    } else {
      this.sideNavService.openSideNav();
      this.sideNavService.setSideNavMode(SideNavMode.Side);
    }
  }

  sideNavStatusChanged($event: boolean) {
    this.sideNavService.setSideNavOpenedStatus($event);
  }
}
