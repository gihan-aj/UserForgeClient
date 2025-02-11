import { Component, OnInit, signal } from '@angular/core';

import { MatExpansionModule } from '@angular/material/expansion';
import { MatChipsModule } from '@angular/material/chips';
import { MatCardModule } from '@angular/material/card';

import { PermissionService } from '../shared/services/permission.service';
import { Permissions } from './models/permissions.model';
import { ErrorHandlingService } from '../shared/error-handling/error-handling.service';
import { RippleLoadingScreen } from '../shared/components/ripple-loading-screen/ripple-loading-screen.component';

@Component({
  selector: 'app-permissions',
  imports: [
    RippleLoadingScreen,
    MatExpansionModule,
    MatChipsModule,
    MatCardModule,
  ],
  templateUrl: './permissions.component.html',
  styleUrl: './permissions.component.scss',
})
export class PermissionsComponent implements OnInit {
  permssions = signal<Permissions | null>(null);
  loading = signal(false);

  step = signal(0);
  setStep(index: number) {
    this.step.set(index);
  }
  nextStep() {
    this.step.update((i) => i + 1);
  }
  prevStep() {
    this.step.update((i) => i - 1);
  }

  constructor(
    private permssionService: PermissionService,
    private errorHandler: ErrorHandlingService
  ) {}

  ngOnInit(): void {
    this.getAllPermissiosns();
  }

  private getAllPermissiosns() {
    this.loading.set(true);
    this.permssionService.getAllPermssions().subscribe({
      next: (response) => {
        this.permssions.set(new Permissions(response));
        this.loading.set(false);
      },
      error: (error) => {
        this.errorHandler.handle(error);
        this.loading.set(false);
      },
    });
  }
}
