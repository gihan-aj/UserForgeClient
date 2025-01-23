import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MessageService } from '../../messages/message.service';

@Component({
  selector: 'app-not-found',
  imports: [RouterLink, MatButtonModule, MatDividerModule],
  templateUrl: 'not-found.component.html',
  styleUrl: 'not-found.component.scss',
})
export class NotFoundComponent {
  msgService = inject(MessageService);
}
