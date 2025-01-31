import { Component, signal } from '@angular/core';
import { AuthService } from '../shared/services/auth.service';
import { FloatingImageComponent } from '../shared/components/floating-image/floating-image.component';
import { APP_TITLE } from '../shared/constants/app-title';

@Component({
  selector: 'app-home',
  imports: [FloatingImageComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  appName = APP_TITLE;
  fullName = signal<string | undefined>(undefined);

  constructor(private authService: AuthService) {
    this.authService.user$.subscribe((user) => {
      if (user) {
        this.fullName.set(user.fullName);
      }
    });
  }
}
