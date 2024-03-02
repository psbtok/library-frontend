// book-list.component.ts

import { Component, OnInit } from '@angular/core';
import { forkJoin } from 'rxjs';
import { BookService } from '../../services/book.service';
import { Book } from '../../models/book.model';

@Component({
  selector: 'app-book-list',
  templateUrl: './book-list.component.html',
  styleUrls: ['./book-list.component.scss']
})
export class BookListComponent implements OnInit {
  books: Book[] = [];
  filteredBooks: Book[] = [];

  constructor(private bookService: BookService) {}

  ngOnInit(): void {
    this.loadBooks();
  }

  loadBooks(): void {
    forkJoin([
      this.bookService.getBooks(),
      this.bookService.getAuthors()
    ]).subscribe(([booksResponse, authorsResponse]) => {
      console.log(authorsResponse);
      this.books = booksResponse.map(book => {
        const author = authorsResponse.find(author => author.uuid === book.author_uuid);
        return { ...book, author: author ? author.name : 'Unknown Author' };
      });

      this.filteredBooks = [...this.books];
    });
  }

  searchBooks(searchTerm: string): void {
    console.log(this.filteredBooks);
    this.filteredBooks = this.books.filter(book =>
      book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.author.toLowerCase().includes(searchTerm.toLowerCase())
    );
    console.log(this.filteredBooks);
  }
}
