import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BookService {
  private apiUrl = 'http://localhost:8000';

  constructor(private http: HttpClient) {}
  
  getBooks(): Observable<any[]> {
    const booksUrl = `${this.apiUrl}/books`;
    return this.http.get<any[]>(booksUrl);
  }

  getAuthors(): Observable<any[]> {
    const authorsUrl = `${this.apiUrl}/authors`;
    return this.http.get<any[]>(authorsUrl);
  }
}
