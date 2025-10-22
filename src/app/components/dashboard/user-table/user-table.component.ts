import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataService } from '../../../services/data.service';
import { User } from '../../../models/user.interface';

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

  constructor(private readonly data: DataService) {}

  ngOnInit() {
    this.loading = true;
    this.error = null;
    this.data
      .list()
      .subscribe({
        next: (rows) => {
          this.users = (rows || []).map((u) => ({
            ...u,
            lastLogin: u?.lastLogin ? new Date(u.lastLogin) : (u as any).lastLogin
          }));
          this.loading = false;
        },
        error: (err) => {
          this.error = err?.message || String(err);
          this.loading = false;
        }
      });
  }
}
