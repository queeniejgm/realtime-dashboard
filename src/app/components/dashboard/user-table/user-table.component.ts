import { Component, OnInit, inject } from '@angular/core';
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
  private readonly data = inject(DataService);

  ngOnInit() {
    this.loading = true;
    this.error = null;
    this.data.list().subscribe({
        next: (rows) => {
          this.users = rows || [];
          this.loading = false;
        },
        error: (err) => {
          this.error = err?.message || String(err);
          this.loading = false;
        }
      });
  }
}
