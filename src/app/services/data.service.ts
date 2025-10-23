import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, map, shareReplay, BehaviorSubject, tap, finalize, catchError, throwError } from 'rxjs';
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
  private usersSubject = new BehaviorSubject<User[]>([]);
  public users = this.usersSubject.asObservable();
  private loadingSubject = new BehaviorSubject<boolean>(false);
  public loading$ = this.loadingSubject.asObservable();
  private errorSubject = new BehaviorSubject<string | null>(null);
  public error$ = this.errorSubject.asObservable();

  list(): Observable<User[]> {
    if (!this.users$) {
      const url = `${this.apiBase}/${this.defaultCollection}`;
      this.loadingSubject.next(true);
      this.errorSubject.next(null);
      this.users$ = this.http.get<User[]>(url, { headers: this.headers }).pipe(
        map((rows: any[]) => 
          rows.map((user) => ({
            ...user,
            lastLogin: user.lastLogin ? new Date(user.lastLogin) : user.lastLogin
          }) as User)
        ),
        tap(users => this.usersSubject.next(users)),
        catchError((err) => {
          const message = err?.message || 'Failed to load users';
          this.errorSubject.next(message);
          return throwError(() => err);
        }),
        finalize(() => this.loadingSubject.next(false)),
        shareReplay(1)
      );
    }
    return this.users$;
  }

  updateUsers(users: User[]): void {
    this.usersSubject.next(users);
  }

  refresh(): void {
    this.users$ = undefined;
  }
}
