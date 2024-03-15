import { Component, OnInit } from '@angular/core';
import Dexie from 'dexie';
import { Book } from '../../models/book.model';
import { DbService, db } from '../../services/db';

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

  constructor(private db: DbService) {}

  ngOnInit(): void {
    this.loadBooks();
  }

  async loadBooks(): Promise<void> {
    const db = this.db;
    const [books, authors] = await Promise.all([db.books.toArray(), db.authors.toArray()]);

    this.books = books.map(book => {
      const author = authors.find(author => author.uuid === book.author);

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
  }

  searchBooks(searchTerm: string): void {
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

  async filterBooks(filters: {
    selectedAuthor: string,
    selectedGenre: string,
    selectedLanguage: string,
    searchTerm: string,
    minPages: number | null,
    maxPages: number | null
}): Promise<void> {
    try {
        let filteredBooks = await this.db.books.toArray();

        if (filters.selectedAuthor) {
            filteredBooks = filteredBooks.filter(book => book.author.toLowerCase() === filters.selectedAuthor.toLowerCase());
        }

        if (filters.selectedGenre) {
            filteredBooks = filteredBooks.filter(book => book.genre.toLowerCase() === filters.selectedGenre.toLowerCase());
        }

        if (filters.selectedLanguage) {
            filteredBooks = filteredBooks.filter(book => book.language.toLowerCase() === filters.selectedLanguage.toLowerCase());
        }

        if (filters.searchTerm) {
            const searchTerm = filters.searchTerm.toLowerCase();
            filteredBooks = filteredBooks.filter(book =>
                book.title.toLowerCase().includes(searchTerm) ||
                book.description.toLowerCase().includes(searchTerm) ||
                book.author.toLowerCase().includes(searchTerm)
            );
        }

        if (filters.minPages !== null) {
            filteredBooks = filteredBooks.filter(book => book.pages >= filters.minPages!);
        }

        if (filters.maxPages !== null) {
            filteredBooks = filteredBooks.filter(book => book.pages <= filters.maxPages!);
        }

        this.filteredBooks = filteredBooks;
    } catch (error) {
        console.error('Error filtering books:', error);
    }
  }
}
