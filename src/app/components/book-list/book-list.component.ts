// book-list.component.ts

import { Component, OnInit } from '@angular/core';
import { BookService } from '../../services/book.service';

@Component({
  selector: 'app-book-list',
  templateUrl: './book-list.component.html',
  styleUrls: ['./book-list.component.scss']
})
export class BookListComponent implements OnInit {
  books: any[] = [];

  constructor(private bookService: BookService) {}

  ngOnInit(): void {
    this.bookService.getBooks()
      .subscribe((response: any) => {
        this.books = response;
      });
  }
}
