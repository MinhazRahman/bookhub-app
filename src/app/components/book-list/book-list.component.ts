import { Component, OnInit } from '@angular/core';
import { Book } from 'src/app/common/book';
import { BookService } from 'src/app/services/book.service';

@Component({
  selector: 'app-book-list',
  templateUrl: './book-list.component.html',
  styleUrls: ['./book-list.component.css'],
})
export class BookListComponent implements OnInit {
  // create books property
  books: Book[] = [];
  // inject BookService
  constructor(private bookService: BookService) {}

  ngOnInit(): void {
    this.listBooks();
  }
  listBooks() {
    // method is invoked when we subscribe
    this.bookService.getBookList().subscribe((data) => {
      this.books = data; // assign results to the books array
    });
  }
}
