import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DataService } from '../../../services/data.service';
import { User } from '../../../models/user.interface';

@Component({
  selector: 'app-metrics-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './metrics-card.component.html',
  styleUrl: './metrics-card.component.scss'
})
export class MetricsCardComponent implements OnInit {
  private readonly data = inject(DataService);
  private readonly destroyRef = takeUntilDestroyed();

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

    this.data.list()
      .pipe(this.destroyRef)
      .subscribe({
        next: (rows) => {
          this.calculateMetrics(Array.isArray(rows) ? rows : []);
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
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    return rows.reduce((sum, row) => {
      const lastLogin = row?.lastLogin ? new Date(row.lastLogin) : undefined;
      const isToday = lastLogin && lastLogin >= today && lastLogin < tomorrow;
      
      return sum + (isToday ? (row.revenue || 0) : 0);
    }, 0);
  }
}
