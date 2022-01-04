import { Injectable } from '@angular/core';
import { NgbDateParserFormatter, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';

@Injectable({
  providedIn: 'root'
})
export class DatepickerFormatService extends NgbDateParserFormatter {

  readonly DELIMITER = '.';

  parse(value: string): NgbDateStruct | null {
    if (value) {
      const date = value.split(this.DELIMITER);
      return {
        day: parseInt(date[0], 10),
        month: parseInt(date[1], 10),
        year: parseInt(date[2], 10)
      };
    }
    return null;
  }

  format(date: NgbDateStruct | null): string {
    let result = '';
    if (date) {
      result = (date.day < 10 ? ('0' + date.day) : date.day) + '.'
        + (date.month < 10 ? ('0' + date.month) : date.month) + '.'
        + date.year;
    }
    return result;
  }
}
