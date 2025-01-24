import { Component, input } from '@angular/core';

import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-loading-container',
  imports: [MatProgressSpinnerModule],
  templateUrl: './loading-container.component.html',
  styleUrl: './loading-container.component.scss',
})
export class LoadingContainerComponent {
  loading = input<boolean>(false);
  size = input<number>(40);
}
