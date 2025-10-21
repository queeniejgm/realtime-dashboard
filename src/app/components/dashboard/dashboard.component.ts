import { Component, OnInit } from '@angular/core';
import { MetricsCardComponent } from './metrics-card/metrics-card.component';
import { UserTableComponent } from './user-table/user-table.component';
import { FilterPanelComponent } from './filter-panel/filter-panel.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [MetricsCardComponent, UserTableComponent, FilterPanelComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  ngOnInit() {
    console.log('DashboardComponent initialized');
  }
}
