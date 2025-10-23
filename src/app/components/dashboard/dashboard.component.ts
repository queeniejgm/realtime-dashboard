import { Component, OnInit, inject } from '@angular/core';
import { MetricsCardComponent } from './metrics-card/metrics-card.component';
import { UserTableComponent } from './user-table/user-table.component';
import { FilterPanelComponent } from './filter-panel/filter-panel.component';
import { PullToRefreshDirective } from '../../directives';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [MetricsCardComponent, UserTableComponent, FilterPanelComponent, PullToRefreshDirective],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  private readonly data = inject(DataService);

  ngOnInit() {
    console.log('DashboardComponent initialized');
  }

  onRefresh(): void {
    this.data.refresh();
    this.data.list().subscribe({ error: () => {} });
  }
}
