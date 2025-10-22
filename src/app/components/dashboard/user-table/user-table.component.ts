import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataService } from '../../../services/data.service';
import { User } from '../../../models/user.interface';
import { combineLatest } from 'rxjs';
import { Filter } from '../../../models';
import { FilterService } from '../../../services/filter.service';

@Component({
  selector: 'app-user-table',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-table.component.html',
  styleUrl: './user-table.component.scss'
})
export class UserTableComponent implements OnInit {
  users: User[] = [];
  loading = false;
  error: string | null = null;
  private readonly data = inject(DataService);
  private readonly filters = inject(FilterService);

  ngOnInit() {
    this.loading = true;
    this.error = null;
    combineLatest<[User[], Filter]>([this.data.list(), this.filters.filters$]).subscribe({
      next: ([rows, filter]) => {
        this.users = this.filters.filterUsers(rows || [], filter);
        this.loading = false;
      },
      error: (err) => {
        this.error = err?.message || String(err);
        this.loading = false;
      }
    });
  }
}
