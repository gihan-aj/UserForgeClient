import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';

import { DEFAULT_RETURN_URL } from '../../constants/absolute-routes';

@Component({
  selector: 'app-not-found',
  imports: [RouterLink, MatButtonModule, MatDividerModule],
  templateUrl: 'not-found.component.html',
  styleUrl: 'not-found.component.scss',
})
export class NotFoundComponent {
  defaultReturnUrl = DEFAULT_RETURN_URL;
}
