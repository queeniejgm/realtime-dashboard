import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, map, shareReplay } from 'rxjs';
import { User } from '../models/user.interface';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private readonly http = inject(HttpClient);
  private readonly apiBase = 'https://fulcrumdashboard-8358.restdb.io/rest';
  private readonly apiKey = '68f7e9f47f34edcb46200b8e';
  private readonly defaultCollection = 'db-users';
  private readonly headers = new HttpHeaders({ 'x-apikey': this.apiKey });
  
  private users$?: Observable<User[]>;

  list(): Observable<User[]> {
    if (!this.users$) {
      const url = `${this.apiBase}/${this.defaultCollection}`;
      this.users$ = this.http.get<User[]>(url, { headers: this.headers }).pipe(
        map((rows: any[]) => 
          rows.map((user) => ({
            ...user,
            lastLogin: user.lastLogin ? new Date(user.lastLogin) : user.lastLogin
          }) as User)
        ),
        shareReplay(1)
      );
    }
    return this.users$;
  }

  refresh(): void {
    this.users$ = undefined;
  }
}
