import { NgbDatepickerI18n, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { TranslationWidth } from '@angular/common';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DatepickerTranslationService extends NgbDatepickerI18n {

  private static readonly WEEKDAYS = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
  private static readonly MONTHS_SHORT = ['Янв', 'Февр', 'Март', 'Апр', 'Май', 'Июнь',
    'Июль', 'Авг', 'Сент', 'Окт', 'Нояб', 'Дек'];
  private static readonly MONTHS_FULL = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
    'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'];


  getDayAriaLabel(date: NgbDateStruct): string {
    return `${date.day}.${date.month}.${date.year}`;
  }

  getMonthFullName(month: number, year?: number): string {
    return DatepickerTranslationService.MONTHS_FULL[month - 1];
  }

  getMonthShortName(month: number, year?: number): string {
    return DatepickerTranslationService.MONTHS_SHORT[month - 1];
  }

  getWeekdayLabel(weekday: number, width?: TranslationWidth): string {
    return DatepickerTranslationService.WEEKDAYS[weekday - 1];
  }

}
