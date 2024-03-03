import { Component, Input } from '@angular/core';
import { Book } from '../../models/book.model';

@Component({
  selector: 'app-book-tile',
  templateUrl: './book-tile.component.html',
  styleUrls: ['./book-tile.component.scss']
})
export class BookTileComponent {
  @Input() book: Book = {
    title: '',
    author: '',
    pages: 0,
    language: '',
    genre: '',
    description: ''
  };
}