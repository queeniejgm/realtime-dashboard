import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../models/user.interface';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private readonly http = inject(HttpClient);
  
  private readonly apiBase = 'https://fulcrumdashboard-8358.restdb.io/rest';
  private readonly apiKey = '68f7e9f47f34edcb46200b8e';
  private readonly defaultCollection = 'db-users';

  private headers(): HttpHeaders {
    return new HttpHeaders({
      'x-apikey': this.apiKey
    });
  }

  list(): Observable<User[]> {
    const url = `${this.apiBase.replace(/\/$/, '')}/${this.defaultCollection}`;
    return this.http.get<User[]>(url, { headers: this.headers() });
  }
}
