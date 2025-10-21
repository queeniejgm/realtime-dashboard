import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-metrics-card',
  standalone: true,
  imports: [],
  templateUrl: './metrics-card.component.html',
  styleUrl: './metrics-card.component.scss'
})
export class MetricsCardComponent implements OnInit {
  ngOnInit() {
    console.log('MetricsCardComponent initialized');
  }
}
