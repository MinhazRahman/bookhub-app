import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Book } from '../common/book';
@Injectable({
  providedIn: 'root',
})
export class BookService {
  private baseUrl = 'http://localhost:8080/bookhub/books';

  // inject HttpClient
  constructor(private httpClient: HttpClient) {}

  // Maps the JSON data from Spring Data REST to Book array
  getBookList(): Observable<Book[]> {
    return this.httpClient.get<Book[]>(this.baseUrl);
  }
}
