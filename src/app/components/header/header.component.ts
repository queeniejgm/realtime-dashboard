import { Component, OnInit, inject, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatBadgeModule } from '@angular/material/badge';
import { FilterService } from '../../services/filter.service';
import { DataService } from '../../services/data.service';
import { CommonModule } from '@angular/common';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, MatToolbarModule, MatButtonModule, MatIconModule, MatBadgeModule, MatTooltipModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeaderComponent implements OnInit {
  private readonly filterService = inject(FilterService);
  private readonly dataService = inject(DataService);
  private readonly cdr = inject(ChangeDetectorRef);
  activeFiltersCount = 0;

  ngOnInit() {
    console.log('HeaderComponent initialized');
    this.filterService.filters$.subscribe(filters => {
      this.activeFiltersCount = this.calculateActiveFilters(filters);
      this.cdr.markForCheck();
    });
  }

  refreshData() {
    // Clear cached data
    this.dataService.refresh();
    // Actively trigger a re-fetch so loading state and data update propagate
    this.dataService.list().subscribe({ error: () => {} });
    // Nudge filters stream so consumers recompute with fresh data
    this.filterService.updateFilters(this.filterService.currentFilters);
  }

  private calculateActiveFilters(filters: any): number {
    let count = 0;
    if (filters.searchTerm && filters.searchTerm !== '') count++;
    if (filters.status && filters.status !== 'all') count++;
    if (filters.dateFrom) count++;
    if (filters.dateTo) count++;
    return count;
  }
}
