import { Injectable } from '@angular/core';
import { ShoppingCartItem } from '../common/shopping-cart-item';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ShoppingCartService {
  // declare an array of ShoppingCart object, it will hold the cart items
  shoppingCartItems: ShoppingCartItem[] = [];

  /*
  BehaviorSubject is a subclass of Observable 
  We can use BehaviorSubject to publish events to our code
  The event will be sent to all of the subscribers
  */
  totalPrice: Subject<number> = new BehaviorSubject<number>(0); // give initial value of 0
  totalQuantity: Subject<number> = new BehaviorSubject<number>(0);

  // Create an Storage object that refers to web browser's session storage
  storage: Storage = sessionStorage;

  constructor() {
    // read the data from the storage
    // Here, 'shoppingCartItems' is the key, we can use any name
    let data = JSON.parse(this.storage.getItem('shoppingCartItems')!);
    if (data != null) {
      this.shoppingCartItems = data;

      // compute the totals based on the data that we got from the storage
      this.calculateShoppingCartTotals();
    }
  }

  addToShoppingCart(theShoppingCartItem: ShoppingCartItem) {
    // check if we already have the item in our shopping cart
    let isAlreadyExistsInCart: boolean = false;
    let existingCartItem: ShoppingCartItem = undefined!;

    // find the item in the shopping cart based on item id
    existingCartItem = this.shoppingCartItems.find(
      (tempShoppingCartItem) =>
        tempShoppingCartItem.id === theShoppingCartItem.id
    )!;

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
      totalPriceValue +=
        currentShoppingCartItem.quantity * currentShoppingCartItem.unitPrice;
      totalQuantityValue += currentShoppingCartItem.quantity;
    }

    // publish the updated values to all the subscribers
    this.totalPrice.next(totalPriceValue);
    this.totalQuantity.next(totalQuantityValue);
  }

  persistShoppingCartItems() {
    // here 'shoppingCartItems' is the key
    this.storage.setItem(
      'shoppingCartItems',
      JSON.stringify(this.shoppingCartItems)
    );
  }

  decrementQuantity(theShoppingCartItem: ShoppingCartItem) {
    theShoppingCartItem.quantity--;

    if (theShoppingCartItem.quantity == 0) {
      this.remove(theShoppingCartItem);
    } else {
      this.calculateShoppingCartTotals();
    }
  }

  remove(theShoppingCartItem: ShoppingCartItem) {
    // get the index of the item in the array
    const indexOfTheItem = this.shoppingCartItems.findIndex(
      (tempShoppingCartItem) =>
        tempShoppingCartItem.id == theShoppingCartItem.id
    );
    // if found then remove the item from the array at the given index
    if (indexOfTheItem > -1) {
      this.shoppingCartItems.splice(indexOfTheItem, 1);
    }

    // after removing the item compute the new totals
    this.calculateShoppingCartTotals();
  }
}
