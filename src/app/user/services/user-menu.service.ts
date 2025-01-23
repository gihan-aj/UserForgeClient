import { Injectable } from '@angular/core';
import { MenuItem } from '../../shared/interfaces/menu-item.interface';
import { MessageService } from '../../shared/messages/message.service';
import { AuthService } from '../../shared/services/auth.service';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserMenuService {
  private userMenuSubject = new BehaviorSubject<MenuItem[]>([]);
  userMenu$ = this.userMenuSubject.asObservable();

  constructor(
    private authService: AuthService,
    private msgService: MessageService
  ) {
    this.authService.user$.subscribe({
      next: (user) => {
        if (user) {
          const menu: MenuItem[] = [
            {
              name: this.msgService.getMessage('app.menu.user.profile'),
              icon: 'person',
              routerlink: '/user/user-profile',
            },
            {
              name: this.msgService.getMessage('app.menu.user.settings'),
              icon: 'settings',
              routerlink: '/user/user-settings',
            },
            {
              name: this.msgService.getMessage('app.menu.user.logout'),
              icon: 'logout',
              routerlink: '',
            },
          ];

          this.userMenuSubject.next([...menu]);
        } else {
          const menu: MenuItem[] = [
            {
              name: this.msgService.getMessage('app.menu.user.login'),
              icon: 'login',
              routerlink: '/user/login',
            },
            {
              name: this.msgService.getMessage('app.menu.user.register'),
              icon: 'person_add',
              routerlink: '/user/registration',
            },
          ];

          this.userMenuSubject.next([...menu]);
        }
      },
    });
  }
}
