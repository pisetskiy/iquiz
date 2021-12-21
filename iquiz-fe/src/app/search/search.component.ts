import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
})
export class SearchComponent implements OnInit {

  @Input()
  placeholder: string = '';
  @Output()
  search:EventEmitter<string> = new EventEmitter<string>();
  searchForm: FormGroup = this.fb.group({
    'query': ''
  });

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
  }

  onSubmit(): void {
    this.search.emit((this.searchForm.value.query || '').trim());
  }
}
