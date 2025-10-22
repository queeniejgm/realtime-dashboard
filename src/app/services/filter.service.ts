import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Filter, User } from '../models';

@Injectable({
  providedIn: 'root'
})
export class FilterService {
  private static readonly INITIAL_FILTER: Filter = {
    searchTerm: '',
    status: 'all',
    dateFrom: undefined,
    dateTo: undefined
  };

  private readonly filterSubject: BehaviorSubject<Filter> =
    new BehaviorSubject<Filter>(FilterService.INITIAL_FILTER);

  readonly filters$: Observable<Filter> = this.filterSubject.asObservable();

  get currentFilters(): Filter {
    return this.filterSubject.value;
  }

  setFilters(next: Filter): void {
    const sanitized = this.sanitizeFilter(next);
    this.filterSubject.next(sanitized);
  }

  updateFilters(partial: Partial<Filter>): void {
    const merged: Filter = { ...this.currentFilters, ...partial };
    this.setFilters(merged);
  }

  reset(): void {
    this.filterSubject.next(FilterService.INITIAL_FILTER);
  }

  filterUsers(rows: User[], filters: Filter): User[] {
    if (!Array.isArray(rows) || rows.length === 0) return [];

    const term = (filters.searchTerm ?? '').toLowerCase();
    const hasTerm = term.length > 0;
    const status = filters.status ?? 'all';

    const start = filters.dateFrom ? new Date(filters.dateFrom) : undefined;
    if (start) start.setHours(0, 0, 0, 0);
    const end = filters.dateTo ? new Date(filters.dateTo) : undefined;
    if (end) end.setHours(23, 59, 59, 999);

    const startTime = start?.getTime();
    const endTime = end?.getTime();

    return rows.filter(user => {
      if (status !== 'all' && user.status !== status) return false;

      if (hasTerm) {
        const haystack = `${user.name ?? ''} ${user.email ?? ''}`.toLowerCase();
        if (!haystack.includes(term)) return false;
      }

      if (startTime !== undefined || endTime !== undefined) {
        const loginTime = user.lastLogin ? new Date(user.lastLogin).getTime() : undefined;
        if (!loginTime) return false;
        if (startTime !== undefined && loginTime < startTime) return false;
        if (endTime !== undefined && loginTime > endTime) return false;
      }

      return true;
    });
  }

  private sanitizeFilter(input: Filter): Filter {
    const searchTerm = (input.searchTerm ?? '').trim();

    const dateFrom = this.normalizeDate(input.dateFrom);
    const dateTo = this.normalizeDate(input.dateTo);

    // Ensure range integrity: if from > to, drop the end date
    const rangeValid = dateFrom && dateTo ? dateFrom.getTime() <= dateTo.getTime() : true;

    return {
      searchTerm,
      status: input.status ?? 'all',
      dateFrom: dateFrom ?? undefined,
      dateTo: rangeValid ? (dateTo ?? undefined) : undefined
    };
  }

  private normalizeDate(value: unknown): Date | undefined {
    if (!value) return undefined;
    if (value instanceof Date && !isNaN(value.getTime())) return value;
    if (typeof value === 'string') {
      const parsed = new Date(value);
      return isNaN(parsed.getTime()) ? undefined : parsed;
    }
    return undefined;
  }
}
