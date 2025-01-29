import { Component, signal } from '@angular/core';
import { AuthService } from '../shared/services/auth.service';
import { FloatingImageComponent } from '../shared/components/floating-image/floating-image.component';

@Component({
  selector: 'app-home',
  imports: [FloatingImageComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  fullName = signal<string | undefined>(undefined);

  constructor(private authService: AuthService) {
    this.authService.user$.subscribe((user) => {
      if (user) {
        this.fullName.set(user.fullName);
      }
    });
  }
}
