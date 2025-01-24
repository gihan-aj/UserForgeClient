import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { LoadingContainerComponent } from '../../../shared/widgets/loading-container/loading-container.component';

@Component({
  selector: 'app-login',
  imports: [MatButtonModule, LoadingContainerComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  loading = false;
  load() {
    this.loading = true;
  }
}
