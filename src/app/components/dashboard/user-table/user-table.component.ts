import { Component, OnInit, inject, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { DataService } from '../../../services/data.service';
import { User } from '../../../models/user.interface';
import { combineLatest } from 'rxjs';
import { Filter } from '../../../models';
import { FilterService } from '../../../services/filter.service';
import { HighlightRowDirective } from '../../../directives';

@Component({
  selector: 'app-user-table',
  standalone: true,
  imports: [
    CommonModule, 
    MatTableModule, 
    MatPaginatorModule, 
    MatSortModule, 
    MatProgressSpinnerModule,
    MatCardModule,
    MatChipsModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    HighlightRowDirective
  ],
  templateUrl: './user-table.component.html',
  styleUrl: './user-table.component.scss'
})
export class UserTableComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['name', 'email', 'status', 'lastLogin', 'sessionCount', 'revenue', 'actions'];
  dataSource = new MatTableDataSource<User>([]);
  loading = false;
  error: string | null = null;
  private readonly data = inject(DataService);
  private readonly filters = inject(FilterService);
  private allUsers: User[] = [];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  ngOnInit() {
    this.loading = true;
    this.error = null;
    
    // Initial load
    this.data.list().subscribe();

    // Listen to the shared users observable and filters
    combineLatest<[User[], Filter]>([this.data.users, this.filters.filters$]).subscribe({
      next: ([rows, filter]) => {
        this.allUsers = rows || [];
        const filteredUsers = this.filters.filterUsers(this.allUsers, filter);
        this.dataSource.data = filteredUsers;
        this.loading = false;
      },
      error: (err) => {
        this.error = err?.message || String(err);
        this.loading = false;
      }
    });
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  viewDetails(user: User) {
    console.log('View details for:', user);
    alert(`User Details:\nName: ${user.name}\nEmail: ${user.email}\nStatus: ${user.status}`);
  }

  toggleStatus(user: User) {
    const newStatus = user.status === 'active' ? 'inactive' : 'active';
    user.status = newStatus;
    console.log(`Toggled status for ${user.name} to ${newStatus}`);
    
    // Update the shared state to trigger metrics recalculation
    this.data.updateUsers([...this.allUsers]);
  }
}
