import { Injectable, inject } from '@angular/core';
import { interval } from 'rxjs';
import { DataService } from './data.service';
import { User } from '../models/user.interface';

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {
  private readonly data = inject(DataService);
  private currentUsers: User[] = [];

  constructor() {
    // Keep a local copy of the latest users list
    this.data.users.subscribe(users => {
      this.currentUsers = Array.isArray(users) ? users : [];
    });

    // Mock live updates every 5 seconds
    interval(5000).subscribe(() => {
      if (!this.currentUsers.length) return;

      const now = new Date();
      const next = this.currentUsers.map(u => ({
        ...u,
        sessionCount: (u.sessionCount || 0) + 1,
        sessionDuration: (u.sessionDuration || 0) + 1,
        lastLogin: now,
        revenue: Number(((u.revenue || 0) + Math.random() * 0.5).toFixed(2))
      } as User));

      // Debug visibility in console
      // eslint-disable-next-line no-console
      console.log('[WebsocketService] mock tick - updated', next.length, 'users');

      this.currentUsers = next;
      this.data.updateUsers(next);
    });
  }
}
