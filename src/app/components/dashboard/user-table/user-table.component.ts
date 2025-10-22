import { Component, OnInit, inject, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { DataService } from '../../../services/data.service';
import { User } from '../../../models/user.interface';
import { combineLatest } from 'rxjs';
import { Filter } from '../../../models';
import { FilterService } from '../../../services/filter.service';

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
    MatChipsModule
  ],
  templateUrl: './user-table.component.html',
  styleUrl: './user-table.component.scss'
})
export class UserTableComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['name', 'email', 'status', 'lastLogin', 'sessionCount'];
  dataSource = new MatTableDataSource<User>([]);
  loading = false;
  error: string | null = null;
  private readonly data = inject(DataService);
  private readonly filters = inject(FilterService);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  ngOnInit() {
    this.loading = true;
    this.error = null;
    combineLatest<[User[], Filter]>([this.data.list(), this.filters.filters$]).subscribe({
      next: ([rows, filter]) => {
        const filteredUsers = this.filters.filterUsers(rows || [], filter);
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
}
