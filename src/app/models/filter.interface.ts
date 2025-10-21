export interface Filter {
  searchTerm: string;
  status: 'all' | 'active' | 'inactive';
  dateFrom?: Date;
  dateTo?: Date;
}

