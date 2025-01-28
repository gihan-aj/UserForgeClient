import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatTitle',
  standalone: true,
})
export class FormatTitlePipe implements PipeTransform {
  transform(value: string): string {
    return String(value)
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, (str) => str.toUpperCase());
  }
}
