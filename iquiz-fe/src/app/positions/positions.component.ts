import { Component, OnInit } from '@angular/core';
import { PositionService } from '../service/position.service';
import { Position } from '../domain/position';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-positions',
  templateUrl: './positions.component.html',
  styleUrls: ['./positions.component.scss']
})
export class PositionsComponent implements OnInit {

  load: boolean = false;
  positions: Position[] = [];

  constructor(private service: PositionService) { }

  ngOnInit(): void {
    this.loadPositions();
  }

  loadPositions(): void {
    this.load = true;
    this.service.findAll()
      .pipe(finalize(() => this.load = false))
      .subscribe(positions => this.positions = positions);
  }

}
