import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { FilterService } from '../../../services/filter.service';

@Component({
  selector: 'app-filter-panel',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './filter-panel.component.html',
  styleUrl: './filter-panel.component.scss'
})
export class FilterPanelComponent implements OnInit, OnDestroy {
  form!: FormGroup;
  private subscription = new Subscription();

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly filterService: FilterService
  ) {}

  ngOnInit() {
    this.form = this.formBuilder.group({
      searchTerm: [''],
      status: ['all'],
      dateFrom: [null],
      dateTo: [null]
    });

    // Keep form in sync with global filter state
    this.subscription.add(
      this.filterService.filters$.subscribe(filters => {
        if (!this.form) return;
        this.form.patchValue(
          {
            searchTerm: filters.searchTerm ?? '',
            status: filters.status ?? 'all',
            dateFrom: filters.dateFrom ?? null,
            dateTo: filters.dateTo ?? null
          },
          { emitEvent: false }
        );
      })
    );

    // Push form changes to global filter state
    this.subscription.add(
      this.form.valueChanges.subscribe(value => {
        this.filterService.updateFilters({
          searchTerm: value.searchTerm ?? '',
          status: value.status ?? 'all',
          dateFrom: value.dateFrom ?? undefined,
          dateTo: value.dateTo ?? undefined
        });
      })
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
