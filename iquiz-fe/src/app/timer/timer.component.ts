import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { finalize, interval, map, Observable, takeWhile, tap } from 'rxjs';

@Component({
  selector: 'app-timer',
  templateUrl: './timer.component.html',
})
export class TimerComponent implements OnInit, OnChanges {

  @Input()
  seconds = 0;

  @Output()
  stop = new EventEmitter<void>();

  stopped: boolean = false;

  duration$?: Observable<number>;

  constructor() { }

  ngOnInit(): void {
    this.startTimer();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['seconds']) {
      this.seconds = changes['seconds'].currentValue;
      this.startTimer();
    }
  }

  startTimer() {
    this.stopped = this.seconds < 1;
    if (this.stopped) return;

    const duration = this.seconds;
    this.duration$ = interval(1000)
      .pipe(
        takeWhile(x => (duration - x) > 0),
        map(x => (duration - x) * 1000),
        finalize(() => {
          this.stopped = true;
          this.stop.emit();
        })
      );
  }

}
