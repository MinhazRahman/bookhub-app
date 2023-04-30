import { Injectable } from '@angular/core';
import { ShoppingCartItem } from '../common/shopping-cart-item';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ShoppingCartService {
  // declare an array of ShoppingCart object, it will hold the cart items
  shoppingCartItems: ShoppingCartItem[] = [];

  /*
  Subject is a subclass of Observable 
  We can user Subject to publish events to our code
  The event will be sent to all of the subscribers
  */
  totalPrice: Subject<number> = new Subject<number>();
  totalQuantity: Subject<number> = new Subject<number>();

  constructor() {}

  addToShoppingCart(theShoppingCartItem: ShoppingCartItem) {
    // check if we already have the item in our shopping cart
    let isAlreadyExistsInCart: boolean = false;
    let existingCartItem: ShoppingCartItem = undefined!;

    if (this.shoppingCartItems.length > 0) {
      // find the item in the shopping cart based on item id
      for (let tempShoppingCartItem of this.shoppingCartItems) {
        if (tempShoppingCartItem.id == theShoppingCartItem.id) {
          existingCartItem = tempShoppingCartItem;
          break;
        }
      }
    }

    // check whether we have found the given item
    isAlreadyExistsInCart = existingCartItem != undefined;

    if (isAlreadyExistsInCart) {
      // increment the quantity of the existingCartItem
      existingCartItem.quantity++;
    } else {
      // add the item to theShoppingCartItem array
      this.shoppingCartItems.push(theShoppingCartItem);
    }

    // calculate the total price and quantity of the shopping cart
    this.calculateShoppingCartTotals();
  }

  // calculate the total price and quantity of the shopping cart
  // and publish the values to all the subscribers
  calculateShoppingCartTotals() {
    let totalPriceValue: number = 0;
    let totalQuantityValue: number = 0;

    for (let currentShoppingCartItem of this.shoppingCartItems) {
      totalPriceValue += currentShoppingCartItem.unitPrice;
      totalQuantityValue += currentShoppingCartItem.quantity;
    }

    // publish the updated values to all the subscribers
    this.totalPrice.next(totalPriceValue);
    this.totalQuantity.next(totalQuantityValue);
  }
}
