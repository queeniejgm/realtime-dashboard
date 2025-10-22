import { Component, OnInit, inject } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatBadgeModule } from '@angular/material/badge';
import { FilterService } from '../../services/filter.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, MatToolbarModule, MatButtonModule, MatIconModule, MatBadgeModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit {
  private readonly filterService = inject(FilterService);
  activeFiltersCount = 0;

  ngOnInit() {
    console.log('HeaderComponent initialized');
    this.filterService.filters$.subscribe(filters => {
      this.activeFiltersCount = this.calculateActiveFilters(filters);
    });
  }

  refreshData() {
    // Force a data refresh by resetting filters
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
