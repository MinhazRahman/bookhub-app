import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Book } from '../common/book';
import { BookCategory } from '../common/book-category';
@Injectable({
  providedIn: 'root',
})
export class BookService {
  private baseUrl = 'http://localhost:8080/bookhub/books';
  private categoryUrl = 'http://localhost:8080/bookhub/bookCategories';
  // inject HttpClient
  constructor(private httpClient: HttpClient) {}

  // Maps the JSON data from Spring Data REST to Book array
  // get the list of books for given 'categoryId'
  getBookList(theCategoryId: number): Observable<Book[]> {
    // build the URL based on categoryId
    const searchUrl = `${this.baseUrl}/findByCategoryId/${theCategoryId}`;
    return this.getBooks(searchUrl);
  }

  // get the list of categories from the HTTP response
  // Maps the JSON data from Spring Data REST to BookCategory array
  getBookCategories(): Observable<BookCategory[]> {
    return this.httpClient.get<BookCategory[]>(this.categoryUrl);
  }

  searchBooks(theKeyword: string): Observable<Book[]> {
    // build the URL based on categoryId
    const searchUrl = `${this.baseUrl}/findByNameContaining/${theKeyword}`;
    return this.getBooks(searchUrl);
  }

  // extract Books from JSON response
  private getBooks(searchUrl: string): Observable<Book[]> {
    return this.httpClient
      .get<GetResponseBooks>(searchUrl)
      .pipe(map((response) => response.content));
  }

  getBook(theBookId: number): Observable<Book> {
    // build the url based on bookId
    const bookUrl = `${this.baseUrl}/${theBookId}`;
    return this.httpClient.get<Book>(bookUrl);
  }
}

// extract the JSON array from the Spring data REST json response
interface GetResponseBooks {
  content: Book[];
}
