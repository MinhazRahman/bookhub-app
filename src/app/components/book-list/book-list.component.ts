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
  previousCategoryId: number = 1;
  currentCategoryName: string = '';
  searchMode: boolean = false;
  searchKeyword: string = '';
  previousKeyword: string = '';

  // add properties for pagination
  thePageNumber: number = 1;
  thePageSize: number = 5;
  theTotalElements: number = 0;

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
    // check if the activated route has a parameter 'keyword'
    // 'keyword' is passed in from SearchComponent
    this.searchMode = this.route.snapshot.paramMap.has('keyword');
    if (this.searchMode) {
      this.handleSearchBooks();
    } else {
      this.handleListBooks();
    }
  }

  handleSearchBooks() {
    // get the 'keyword' from the search route
    const theKeyword: string = this.route.snapshot.paramMap.get('keyword')!;
    this.searchKeyword = this.route.snapshot.paramMap.get('keyword')!;

    // check if we have a different keyword than the previous one
    // Angular will reuse a component if it is currently being viewed

    // if we have a different keyword than the previous one
    // then set thePageNumber back to 1
    if (this.previousKeyword != theKeyword) {
      this.thePageNumber = 1;
    }

    this.previousKeyword = theKeyword;

    // search for the books using the given keyword
    this.bookService
      .searchBooksPaginate(this.thePageNumber - 1, this.thePageSize, theKeyword)
      .subscribe(this.processResult());
  }

  handleListBooks() {
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

    // check if we have a different category than the previous one
    // Angular will reuse a component if it is currently being viewed

    // if we have a different category id than the previous one
    // then set thePageNumber back to 1
    if (this.previousCategoryId != this.currentCategoryId) {
      this.thePageNumber = 1;
    }

    this.previousCategoryId = this.currentCategoryId;

    // get the list of books for the given 'categoryId'
    // method is invoked when we subscribe
    // Pagination component: pages are 1 based
    // Spring Data REST: pages are 0 based
    this.bookService
      .getBookListPaginate(
        this.thePageNumber - 1,
        this.thePageSize,
        this.currentCategoryId
      )
      .subscribe(this.processResult());
  }

  // update page size when users select from the drop down
  updatePageSize(value: string) {
    // convert the string to number using '+' operator
    this.thePageSize = +value;
    // reset the page number to 1
    this.thePageNumber = 1;
    this.listBooks();
  }

  // process the JSON response, extract the values from the JSON response
  processResult() {
    return (data: any) => {
      this.books = data.content;
      (this.thePageNumber = data.number + 1), (this.thePageSize = data.size);
      this.theTotalElements = data.totalElements;
    };
  }

  addToCart(theBook: Book) {
    console.log(`Adding Book to cart.. ${theBook.name}: ${theBook.unitPrice}`);
    // Add actual code later....
  }
}
