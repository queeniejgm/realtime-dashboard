export interface User {
  id: string;
  name: string;
  email: string;
  status: 'active' | 'inactive';
  lastLogin: Date;
  sessionCount: number;
  sessionDuration: number; // in minutes
  revenue: number;
}

