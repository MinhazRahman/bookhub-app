import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Book } from '../common/book';
import { BookCategory } from '../common/book-category';
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root',
})
export class BookService {
  private baseUrl = environment.bookHubApiUrl + '/books';
  private categoryUrl = environment.bookHubApiUrl + '/bookCategories';
  // inject HttpClient
  constructor(private httpClient: HttpClient) {}

  // Add pagination support to book service
  getBookListPaginate(
    thePageNumber: number,
    thePageSize: number,
    theCategoryId: number
  ): Observable<GetResponseBooks> {
    // build the URL based on categoryId
    const searchUrl = `${this.baseUrl}/findByCategoryId/${theCategoryId}?page=${thePageNumber}&size=${thePageSize}`;
    return this.httpClient.get<GetResponseBooks>(searchUrl);
  }

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

  // Add pagination support to book service
  searchBooksPaginate(
    thePageNumber: number,
    thePageSize: number,
    theKeyword: string
  ): Observable<GetResponseBooks> {
    // build the URL based on categoryId
    const searchUrl = `${this.baseUrl}/findByNameContaining/${theKeyword}?page=${thePageNumber}&size=${thePageSize}`;
    return this.httpClient.get<GetResponseBooks>(searchUrl);
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
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
}
