import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { NgbTypeahead, NgbTypeaheadSelectItemEvent } from '@ng-bootstrap/ng-bootstrap';
import { debounceTime, distinctUntilChanged, filter, map, merge, Observable, OperatorFunction, Subject } from 'rxjs';

@Component({
  selector: 'app-typeahead',
  templateUrl: './typeahead.component.html',
})
export class TypeaheadComponent implements OnInit {

  @Input()
  public placeholder: string = '';
  @Input()
  public data: any[] = [];
  @Input()
  public searchField: string = '';

  @Output()
  public itemSelect: EventEmitter<any> = new EventEmitter<any>();

  model: any = null;

  @ViewChild('instance', {static: true})
  instance?: NgbTypeahead;
  focus$ = new Subject<string>();
  click$ = new Subject<string>();

  formatter = (x: {[key: string]: string}) => x[this.searchField];

  search: OperatorFunction<string, readonly any[]> = (text$: Observable<string>) => {
    const debouncedText$ = text$.pipe(debounceTime(200), distinctUntilChanged());
    const clicksWithClosedPopup$ = this.click$.pipe(filter(() => !this.instance?.isPopupOpen()));
    const inputFocus$ = this.focus$;

    return merge(debouncedText$, inputFocus$, clicksWithClosedPopup$)
      .pipe(map(term => {
        if (term === '') {
          return this.data.slice(0, 10);
        } else {
          let regexp = new RegExp(term, 'i');
          return this.data.filter(v => regexp.test(v[this.searchField])).slice(0, 10)
        }
      }))
  }

  constructor() {
  }

  ngOnInit(): void {
  }

  prepareModel(event: NgbTypeaheadSelectItemEvent<any>): void {
    this.model = event.item
  }

  emitAdd(): void {
    if (this.model) {
      this.itemSelect.emit(this.model);
      this.instance?.writeValue(null);
    }
  }

}
