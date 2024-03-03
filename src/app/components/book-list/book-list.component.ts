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
  selectedBook: Book | null = null;
  languages: string[] = [];
  genres: string[] = [];
  authors: string[] = [];
  minPages: number | null = null;
  maxPages: number | null = null;

  constructor(private bookService: BookService) {}

  ngOnInit(): void {
    this.loadBooks();
  }

  loadBooks(): void {
    forkJoin([
      this.bookService.getBooks(),
      this.bookService.getAuthors()
    ]).subscribe(([booksResponse, authorsResponse]) => {
      this.books = booksResponse.map(book => {
        const author = authorsResponse.find(author => author.uuid === book.author_uuid);

        if (author && !this.authors.includes(author.name)) {
          this.authors.push(author.name);
        }
        
        if (!this.languages.includes(book.language)) {
          this.languages.push(book.language);
        }

        if (!this.genres.includes(book.genre)) {
          this.genres.push(book.genre);
        }

        return { ...book, author: author ? author.name : 'Unknown Author' };
      });

      this.filteredBooks = [...this.books];
    });
  }

  searchBooks(searchTerm: string): void {
    console.log("SEACH EVENT")
    this.filteredBooks = this.books.filter(book =>
      book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.author.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }

  openBookPreview(book: Book): void {
    this.selectedBook = book;
  }

  closeBookPreview(): void {
    this.selectedBook = null;
  }

  filterBooks(filters: {
    selectedAuthor: string,
    selectedGenre: string,
    selectedLanguage: string,
    searchTerm: string,
    minPages: number | null,
    maxPages: number | null
  }): void {
    this.filteredBooks = this.books.filter(book => {
      const authorMatch = !filters.selectedAuthor || book.author.toLowerCase() === filters.selectedAuthor.toLowerCase();
      const genreMatch = !filters.selectedGenre || book.genre.toLowerCase() === filters.selectedGenre.toLowerCase();
      const languageMatch = !filters.selectedLanguage || book.language.toLowerCase() === filters.selectedLanguage.toLowerCase();
      const searchTermMatch = !filters.searchTerm ||
        book.title.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
        book.description.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
        book.author.toLowerCase().includes(filters.searchTerm.toLowerCase());
      const minPagesMatch = filters.minPages ? book.pages >= filters.minPages : true;
      const maxPagesMatch = filters.maxPages ? book.pages <= filters.maxPages : true;
      
      return authorMatch && genreMatch && languageMatch && searchTermMatch && minPagesMatch && maxPagesMatch;
    });
  }
}
