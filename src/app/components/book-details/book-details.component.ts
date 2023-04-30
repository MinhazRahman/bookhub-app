import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Book } from 'src/app/common/book';
import { ShoppingCartItem } from 'src/app/common/shopping-cart-item';
import { BookService } from 'src/app/services/book.service';
import { ShoppingCartService } from 'src/app/services/shopping-cart.service';

@Component({
  selector: 'app-book-details',
  templateUrl: './book-details.component.html',
  styleUrls: ['./book-details.component.css'],
})
export class BookDetailsComponent implements OnInit {
  book!: Book;

  // inject bookService and route properties
  constructor(
    private bookService: BookService,
    private route: ActivatedRoute,
    private shoppingCartService: ShoppingCartService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(() => {
      this.handleBookDetails();
    });
  }

  // manage and initialize the book object
  handleBookDetails() {
    // get the parameter 'id' string and convert it into a number using '+' operator
    const theBookId: number = +this.route.snapshot.paramMap.get('id')!;
    this.bookService.getBook(theBookId).subscribe((data) => {
      this.book = data;
    });
  }

  addToCart() {
    // By the time we add the Book to the cart it has been initialized and loaded with data
    // create the ShoppingCartItem object
    const theShoppingCartItem = new ShoppingCartItem(this.book);
    // call the addToShoppingCart() method to add item to the shopping cart
    this.shoppingCartService.addToShoppingCart(theShoppingCartItem);
  }
}
