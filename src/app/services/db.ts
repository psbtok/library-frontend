// db.service.ts
import { Injectable } from '@angular/core';
import Dexie, { Table } from 'dexie';
import { Book } from '../models/book.model';
import { Author } from '../models/author.model';

@Injectable({
  providedIn: 'root'
})
export class DbService extends Dexie {
  books!: Table<Book, number>;
  authors!: Table<Author, string>;

  constructor() {
    super('library');
    this.version(3).stores({
      books: '++id, title, author, pages, language, genre, description',
      authors: '++uuid, name, updatedName, updatedUuid, editMode'
    });

    this.isEmpty().then(isEmpty => {
      if (isEmpty) {
        this.populateAuthors();
        this.populateBooks();
      }
    });
  }

  async populateAuthors() {
    const defaultAuthors: Author[] = [
      { uuid: '1', name: 'Author 1', editMode: false },
      { uuid: '2', name: 'Author 2', editMode: false },
    ];

    await this.authors.bulkPut(defaultAuthors);
  }

  async populateBooks() {
    const defaultBooks: Book[] = [
      { title: 'Book 1', author: '1', pages: 200, language: 'English', genre: 'Fiction', description: 'Description 1' },
      { title: 'Book 2', author: '2', pages: 250, language: 'English', genre: 'Non-Fiction', description: 'Description 2' },
    ];

    await this.books.bulkPut(defaultBooks);
  }

  private async isEmpty(): Promise<boolean> { 
    const count = await this.books.count();
    return count === 0;
  }
}

export const db = new DbService();
