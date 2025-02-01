import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DEFAULT_RETURN_URL } from '../../constants/absolute-routes';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';

@Component({
  selector: 'app-access-denied',
  imports: [RouterLink, MatButtonModule, MatDividerModule],
  templateUrl: './access-denied.component.html',
  styleUrl: './access-denied.component.scss',
})
export class AccessDeniedComponent {
  defaultReturnUrl = DEFAULT_RETURN_URL;
}
