import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-filter-panel',
  standalone: true,
  imports: [],
  templateUrl: './filter-panel.component.html',
  styleUrl: './filter-panel.component.scss'
})
export class FilterPanelComponent implements OnInit {
  ngOnInit() {
    console.log('FilterPanelComponent initialized');
  }
}
