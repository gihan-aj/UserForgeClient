import { computed, HostListener, Injectable, signal } from '@angular/core';
import { LARGE_SCREEN_LOWER_LIMIT } from '../../shared/constants/screen-size';
import { SideNavMode } from './side-nav-mode.enum';
import { AuthService } from '../../shared/services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class SideNavService {
  private sideNavOpened = signal<boolean>(false);
  private sideNavMode = signal<SideNavMode>(SideNavMode.Side);

  openSideNav(): void {
    this.sideNavOpened.set(true);
  }

  closeSideNav(): void {
    this.sideNavOpened.set(false);
  }

  toggleNavBar(): void {
    this.sideNavOpened.set(!this.sideNavOpened());
  }

  setSideNavOpenedStatus(status: boolean) {
    if (this.sideNavOpened() !== status) this.sideNavOpened.set(status);
  }

  setSideNavMode(mode: SideNavMode): void {
    this.sideNavMode.set(mode);
  }

  sideNavStatus = computed(() => {
    return this.sideNavOpened();
  });

  sideNavModeStaus = computed(() => {
    return this.sideNavMode();
  });
}
