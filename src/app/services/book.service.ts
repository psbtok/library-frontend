// book.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Book } from '../models/book.model';
import { Author } from '../models/author.model';

@Injectable({
  providedIn: 'root'
})
export class BookService {
  private apiUrl = '';

  constructor(private http: HttpClient) {}

  getBooks(): Observable<any[]> {
    const booksUrl = `${this.apiUrl}/books`;
    return this.http.get<Book[]>(booksUrl);
  }

  getAuthors(): Observable<any[]> {
    const authorsUrl = `${this.apiUrl}/authors`;
    return this.http.get<Author[]>(authorsUrl);
  }

  createBook(book: Book): Observable<any> {
    const createBookUrl = `${this.apiUrl}/books`;
    return this.http.post<Book>(createBookUrl, book);
  }

  createAuthor(author: { uuid: string; name: string }): Observable<any> {
    const createAuthorUrl = `${this.apiUrl}/authors`;
    return this.http.post<Author>(createAuthorUrl, author);
  }

  resetData(): Observable<any> {
    const resetDataUrl = `${this.apiUrl}/reset_data`;
    return this.http.post<any>(resetDataUrl, {});
  }
}
