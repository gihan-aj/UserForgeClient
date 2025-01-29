import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';

import { BreadcrumbService } from './breadcrumb.service';
import { BreadcrumbItem } from './breadcrumb-item.interface';
import { DEFAULT_RETURN_URL } from '../constants/absolute-routes';

@Component({
  selector: 'app-breadcrumb',
  imports: [
    CommonModule,
    RouterLink,
    MatButtonModule,
    MatIconModule,
    MatListModule,
  ],
  templateUrl: './breadcrumb.component.html',
  styleUrl: './breadcrumb.component.scss',
})
export class BreadcrumbComponent {
  breadcrumbs$: Observable<BreadcrumbItem[]>;

  defaultReturnUrl = DEFAULT_RETURN_URL;

  constructor(private breadcrumbService: BreadcrumbService) {
    this.breadcrumbs$ = breadcrumbService.breadcrumbs$;
  }
}
