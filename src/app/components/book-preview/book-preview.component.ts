import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Book } from '../../models/book.model';

@Component({
  selector: 'app-book-preview',
  templateUrl: './book-preview.component.html',
  styleUrls: ['./book-preview.component.scss']
})
export class BookPreviewComponent {
  @Input() book: Book = {
    title: '',
    author: '',
    pages: 0,
    language: '',
    genre: '',
    description: ''
  };
  
  @Output() closePreviewEvent = new EventEmitter<void>();

  closePreview(): void {
    this.closePreviewEvent.emit();
  }
}
