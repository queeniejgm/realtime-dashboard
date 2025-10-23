import { Component, OnInit, inject, DestroyRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { DataService } from '../../../services/data.service';
import { User } from '../../../models/user.interface';
import { Filter } from '../../../models';
import { combineLatest } from 'rxjs';
import { FilterService } from '../../../services/filter.service';
import { DurationPipe } from '../../../pipes';

@Component({
  selector: 'app-metrics-card',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatProgressSpinnerModule, MatIconModule, DurationPipe],
  templateUrl: './metrics-card.component.html',
  styleUrl: './metrics-card.component.scss'
})
export class MetricsCardComponent implements OnInit {
  private readonly data = inject(DataService);
  private readonly filters = inject(FilterService);
  private readonly destroyRef = inject(DestroyRef);

  loading = false;
  error: string | null = null;

  metrics = {
    totalActiveUsers: 0,
    averageSessionDuration: 0,
    conversionRate: 0,
    revenueToday: 0
  };

  ngOnInit() {
    this.loading = true;
    this.error = null;

    combineLatest<[User[], Filter]>([this.data.list(), this.filters.filters$])
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: ([rows, filter]) => {
          const filtered = this.filters.filterUsers(Array.isArray(rows) ? rows : [], filter);
          this.calculateMetrics(filtered);
          this.loading = false;
        },
        error: (err) => {
          this.error = err?.message || String(err);
          this.loading = false;
        }
      });
  }

  private calculateMetrics(rows: User[]) {
    const activeUsers = rows.filter(row => row.status === 'active');

    this.metrics = {
      totalActiveUsers: this.calculateTotalActiveUsers(activeUsers),
      averageSessionDuration: this.calculateAverageSessionDuration(activeUsers),
      conversionRate: this.calculateConversionRate(activeUsers),
      revenueToday: this.calculateRevenueToday(rows)
    };
  }

  private calculateTotalActiveUsers(activeUsers: User[]): number {
    return activeUsers.length;
  }

  private calculateAverageSessionDuration(activeUsers: User[]): number {
    if (activeUsers.length === 0) return 0;
    
    const totalSessionDuration = activeUsers.reduce(
      (sum, user) => sum + (user.sessionDuration || 0), 
      0
    );
    
    return totalSessionDuration / activeUsers.length;
  }

  private calculateConversionRate(activeUsers: User[]): number {
    if (activeUsers.length === 0) return 0;
    
    const converters = activeUsers.filter(user => (user.revenue || 0) > 0).length;
    
    return converters / activeUsers.length;
  }

  private calculateRevenueToday(rows: User[]): number {
    return rows.reduce((sum, row) => {
      return sum + (row.revenue || 0);
    }, 0);
  }
}
