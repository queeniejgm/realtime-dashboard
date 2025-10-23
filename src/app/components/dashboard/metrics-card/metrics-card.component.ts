import { Component, OnInit, inject, DestroyRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { trigger, state, style, transition, animate } from '@angular/animations';
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
  styleUrl: './metrics-card.component.scss',
  animations: [
    trigger('cardAppear', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate('300ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ]),
    trigger('valueChange', [
      transition('* => *', [
        style({ transform: 'scale(1)' }),
        animate('200ms ease-in', style({ transform: 'scale(1.1)', color: '#3f51b5' })),
        animate('200ms ease-out', style({ transform: 'scale(1)', color: '*' }))
      ])
    ])
  ]
})
export class MetricsCardComponent implements OnInit {
  private readonly data = inject(DataService);
  private readonly filters = inject(FilterService);
  private readonly destroyRef = inject(DestroyRef);
  public readonly loading$ = this.data.loading$;
  public readonly error$ = this.data.error$;

  metrics = {
    totalActiveUsers: 0,
    averageSessionDuration: 0,
    conversionRate: 0,
    revenueToday: 0
  };

  // Track animation states for value changes
  animationStates = {
    totalActiveUsers: 0,
    averageSessionDuration: 0,
    conversionRate: 0,
    revenueToday: 0
  };

  ngOnInit() {
    // Initial load
    this.data.list().subscribe({ error: () => {} });

    // Listen to both the shared users observable and filters
    combineLatest<[User[], Filter]>([this.data.users, this.filters.filters$])
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: ([rows, filter]) => {
          const filtered = this.filters.filterUsers(Array.isArray(rows) ? rows : [], filter);
          this.calculateMetrics(filtered);
        },
        error: () => {}
      });
  }

  private calculateMetrics(rows: User[]) {
    const activeUsers = rows.filter(row => row.status === 'active');

    const newMetrics = {
      totalActiveUsers: this.calculateTotalActiveUsers(activeUsers),
      averageSessionDuration: this.calculateAverageSessionDuration(activeUsers),
      conversionRate: this.calculateConversionRate(activeUsers),
      revenueToday: this.calculateRevenueToday(rows)
    };

    // Update animation states when values change
    if (newMetrics.totalActiveUsers !== this.metrics.totalActiveUsers) {
      this.animationStates.totalActiveUsers++;
    }
    if (newMetrics.averageSessionDuration !== this.metrics.averageSessionDuration) {
      this.animationStates.averageSessionDuration++;
    }
    if (newMetrics.conversionRate !== this.metrics.conversionRate) {
      this.animationStates.conversionRate++;
    }
    if (newMetrics.revenueToday !== this.metrics.revenueToday) {
      this.animationStates.revenueToday++;
    }

    this.metrics = newMetrics;
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
