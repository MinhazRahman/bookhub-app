import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
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
  currentCategoryId: number = 1;
  currentCategoryName: string = '';

  // inject BookService, ActivatedRoute
  constructor(
    private bookService: BookService,
    private route: ActivatedRoute // current active route that loaded the component, getting route info
  ) {}

  // Update the ngOnInit() method to access the ActivatedRoute
  ngOnInit(): void {
    this.route.paramMap.subscribe(() => {
      this.listBooks();
    });
  }
  listBooks() {
    // use activated route to track the 'categoryId' parameter, check if 'categoryId' is available
    const hasCategoryId: boolean = this.route.snapshot.paramMap.has('id');

    // get the 'categoryId' parameter string and convert it into number using '+' operator
    if (hasCategoryId) {
      // user null assertion operator '!' is to tell the compiler that the object is not null
      this.currentCategoryId = +this.route.snapshot.paramMap.get('id')!;

      // get the "name" param string
      this.currentCategoryName = this.route.snapshot.paramMap.get('name')!;
    } else {
      // 'categoryId' is not available and make the default category id to 1
      this.currentCategoryId = 1;
      this.currentCategoryName = 'Programming';
    }

    // get the list of books for the given 'categoryId'
    // method is invoked when we subscribe
    this.bookService.getBookList(this.currentCategoryId).subscribe((data) => {
      this.books = data; // assign results to the books array
    });
  }
}
