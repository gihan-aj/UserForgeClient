import { Component, OnDestroy, OnInit, signal } from '@angular/core';

import { MatExpansionModule } from '@angular/material/expansion';
import { MatChipsModule } from '@angular/material/chips';
import { MatCardModule } from '@angular/material/card';

import { PermissionService } from '../shared/services/permission.service';
import { Permissions } from './models/permissions.model';
import { ErrorHandlingService } from '../shared/error-handling/error-handling.service';
import { LoadingService } from '../shared/services/loading.service';
import { Subject, takeUntil } from 'rxjs';
import { AppDetails } from '../app-management/app-details.interface';
import { AppManagementService } from '../app-management/services/app-management.service';
import { SortOrder } from '../shared/widgets/table/sort-order.enum';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormatTitlePipe } from '../shared/pipes/format-title.pipe';
import { CommonModule } from '@angular/common';
import { PermissionDetails } from './interfaces/permission-details.interface';

const PAGE_TITLE = 'Permissions';

@Component({
  selector: 'app-permissions',
  imports: [
    CommonModule,
    MatExpansionModule,
    MatChipsModule,
    MatCardModule,
    MatFormFieldModule,
    MatSelectModule,
    FormatTitlePipe,
  ],
  templateUrl: './permissions.component.html',
  styleUrl: './permissions.component.scss',
})
export class PermissionsComponent implements OnInit, OnDestroy {
  pageTitle = PAGE_TITLE;

  // permssions = signal<Permissions | null>(null);
  permissions: { [key: string]: PermissionDetails[] } = {};
  headers: string[] = [];
  loading = signal(false);

  selectedAppId: number = 1;
  appList: AppDetails[] = [];

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

  private destroy$: Subject<void> = new Subject<void>();

  constructor(
    private permssionService: PermissionService,
    private appManagementService: AppManagementService,
    private loadingService: LoadingService
  ) {
    this.loadingService.loading$
      .pipe(takeUntil(this.destroy$))
      .subscribe((isLoading) => {
        if (isLoading) {
          this.loading.set(true);
        } else {
          this.loading.set(false);
        }
      });
  }

  ngOnInit(): void {
    this.appManagementService
      .fetchDataSet({
        page: 1,
        pageSize: 100,
        searchTerm: '',
        sortColumn: 'id',
        sortOrder: SortOrder.ascending,
      })
      .subscribe((response) => {
        this.appList = response.items.filter((app) => app.isActive);
        this.selectedAppId = response.items[0].id;

        this.getAllPermissiosns(this.selectedAppId);
      });
  }

  private getAllPermissiosns(appId: number) {
    this.loadingService.start();
    this.permissions = {};

    this.permssionService.getAllPermssions(appId).subscribe((res) => {
      if (res) {
        res.forEach((permission) => {
          const key = permission.name.split('.')[0];
          if (!this.permissions[key]) {
            this.permissions[key] = [permission];
          } else {
            this.permissions[key].push(permission);
          }
        });

        this.headers = Object.keys(this.permissions);
      }
      this.loadingService.finish();
    });
  }

  onAppChange(event: MatSelectChange) {
    this.getAllPermissiosns(event.value);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
