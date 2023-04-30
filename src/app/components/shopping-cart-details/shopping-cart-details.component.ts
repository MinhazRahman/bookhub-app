import { Component, OnInit } from '@angular/core';
import { ShoppingCartItem } from 'src/app/common/shopping-cart-item';
import { ShoppingCartService } from 'src/app/services/shopping-cart.service';

@Component({
  selector: 'app-shopping-cart-details',
  templateUrl: './shopping-cart-details.component.html',
  styleUrls: ['./shopping-cart-details.component.css'],
})
export class ShoppingCartDetailsComponent implements OnInit {
  shoppingCartItems: ShoppingCartItem[] = [];
  totalPrice: number = 0;
  totalQuantity: number = 0;

  // inject shoppingCartService
  constructor(private shoppingCartService: ShoppingCartService) {}

  ngOnInit(): void {
    this.listShoppingCartDetails();
  }

  listShoppingCartDetails() {
    // get a handle to the shopping cart items
    this.shoppingCartItems = this.shoppingCartService.shoppingCartItems;

    // subscribe to the totalPrice
    this.shoppingCartService.totalPrice.subscribe(
      (data) => (this.totalPrice = data)
    );

    // subscribe to the totalQuantity
    this.shoppingCartService.totalQuantity.subscribe(
      (data) => (this.totalQuantity = data)
    );

    // calculate shopping cart total price and quantity
    this.shoppingCartService.calculateShoppingCartTotals();
  }

  // increment the quantity of the item when user clicks on the increment button on the shopping cart
  incrementQuantity(theShoppingCartItem: ShoppingCartItem) {
    this.shoppingCartService.addToShoppingCart(theShoppingCartItem);
  }

  // decrement the quantity of the item when user clicks on the decrement button on the shopping cart
  decrementQuantity(theShoppingCartItem: ShoppingCartItem) {
    this.shoppingCartService.decrementQuantity(theShoppingCartItem);
  }

  // remove item from the shopping cart
  remove(theShoppingCartItem: ShoppingCartItem) {
    this.shoppingCartService.remove(theShoppingCartItem);
  }
}
