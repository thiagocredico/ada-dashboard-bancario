import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'negativeValues',
})
export class NegativeValuesPipe implements PipeTransform {
  transform(value: number): string {
    if (value > 0) {
      return 'text-success';
    }
    if (value < 0) {
      return 'text-danger';
    }

    return '';
  }
}
