import { Component, OnDestroy, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { MatProgressBarModule } from '@angular/material/progress-bar';
import { UserPageLoadingService } from './services/user-page-loading.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-user',
  imports: [RouterOutlet, MatProgressBarModule],
  templateUrl: './user.component.html',
  styleUrl: './user.component.scss',
})
export class UserComponent implements OnDestroy {
  loading = signal(false);
  loadingSubscription: Subscription;

  constructor(private loadingService: UserPageLoadingService) {
    this.loadingSubscription = this.loadingService.loading$.subscribe(
      (loading) => {
        this.loading.set(loading);
      }
    );
  }

  ngOnDestroy(): void {
    if (this.loadingSubscription) {
      this.loadingSubscription.unsubscribe();
    }
  }
}
