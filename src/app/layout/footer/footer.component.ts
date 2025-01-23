import { Component, inject, signal, WritableSignal } from '@angular/core';
import { MessageService } from '../../shared/messages/message.service';

@Component({
  selector: 'app-footer',
  imports: [],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss',
})
export class FooterComponent {
  msgService = inject(MessageService);

  year: WritableSignal<number> = signal(0);

  constructor() {
    this.year.set(new Date().getFullYear());
  }
}
