import {
  ChangeDetectionStrategy,
  Component,
  model,
  signal,
} from '@angular/core';

import {
  MatDatepickerInputEvent,
  MatDatepickerModule,
} from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MAT_DATE_FORMATS } from '@angular/material/core';
import { provideMomentDateAdapter } from '@angular/material-moment-adapter';
import { FormsModule } from '@angular/forms';

const dateFormats = MAT_DATE_FORMATS;

@Component({
  selector: 'app-datepicker',
  imports: [
    FormsModule,
    MatDatepickerModule,
    MatInputModule,
    MatFormFieldModule,
  ],
  templateUrl: './datepicker.component.html',
  styleUrl: './datepicker.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DatepickerComponent {
  events = signal<string[]>([]);

  addEvent(type: string, event: MatDatepickerInputEvent<Date>) {
    this.events.update((events) => [...events, `${type}: ${event.value}`]);
  }
}
