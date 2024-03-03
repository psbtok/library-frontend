import { Component, Output, EventEmitter, Input } from '@angular/core';

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.scss'],
})
export class SearchBarComponent {
  @Input() selectedAuthor: string = '';
  @Input() selectedGenre: string = '';
  @Input() selectedLanguage: string = '';
  @Input() searchTerm: string = '';
  @Input() authors: string[] = [];
  @Input() genres: string[] = [];
  @Input() languages: string[] = [];

  minPages: number | null = null;
  maxPages: number | null = null;

  @Output() filterChangeEvent = new EventEmitter();
  @Output() searchEvent = new EventEmitter<string>();

  clearSearch() {
    this.searchTerm = '';
    this.searchEvent.emit('');
    this.emitFilterChanges();
  }

  search() {
    this.searchEvent.emit(this.searchTerm);
    this.emitFilterChanges();
  }

  filterChange() {
    this.emitFilterChanges();
  }

  emitFilterChanges() {
    this.filterChangeEvent.emit({
      selectedAuthor: this.selectedAuthor,
      selectedGenre: this.selectedGenre,
      selectedLanguage: this.selectedLanguage,
      searchTerm: this.searchTerm,
      minPages: this.minPages,
      maxPages: this.maxPages,
    });
  }

  resetFilters() {
    this.selectedAuthor = '';
    this.selectedGenre = '';
    this.selectedLanguage = '';
    this.searchTerm = '';
    this.minPages = null;
    this.maxPages = null;
    this.emitFilterChanges();
  }
}
