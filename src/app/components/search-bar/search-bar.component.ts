import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.scss'],
})
export class SearchBarComponent {
  searchTerm: string = '';

  @Output() searchEvent = new EventEmitter<string>();

  clearSearch() {
    this.searchTerm = '';
    this.searchEvent.emit('');
  }

  search() {
    this.searchEvent.emit(this.searchTerm);
  }
}
