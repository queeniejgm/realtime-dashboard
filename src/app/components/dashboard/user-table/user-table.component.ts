import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-user-table',
  standalone: true,
  imports: [],
  templateUrl: './user-table.component.html',
  styleUrl: './user-table.component.scss'
})
export class UserTableComponent implements OnInit {
  ngOnInit() {
    console.log('UserTableComponent initialized');
  }
}
