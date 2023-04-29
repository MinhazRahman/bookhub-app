import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Book } from '../common/book';
@Injectable({
  providedIn: 'root',
})
export class BookService {
  private baseUrl = 'http://localhost:8080/bookhub/books';

  // inject HttpClient
  constructor(private httpClient: HttpClient) {}

  // Maps the JSON data from Spring Data REST to Book array
  // get the list of books for given 'categoryId'
  getBookList(theCategoryId: number): Observable<Book[]> {
    // build the URL based on categoryId
    const searchURL = `${this.baseUrl}/findByCategoryId/${theCategoryId}`;
    return this.httpClient
      .get<GetResponse>(searchURL)
      .pipe(map((response) => response.content));
  }
}

// extract the array of books from the json response
interface GetResponse {
  content: Book[];
}
