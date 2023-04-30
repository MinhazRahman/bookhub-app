import { Component, OnInit } from '@angular/core';
import { ShoppingCartService } from 'src/app/services/shopping-cart.service';

@Component({
  selector: 'app-shopping-cart-status',
  templateUrl: './shopping-cart-status.component.html',
  styleUrls: ['./shopping-cart-status.component.css'],
})
export class ShoppingCartStatusComponent implements OnInit {
  totalPrice: number = 0.0;
  totalQuantity: number = 0;

  constructor(private shoppingCartService: ShoppingCartService) {}

  ngOnInit(): void {
    this.updateShoppingCartStatus();
  }

  updateShoppingCartStatus() {
    // subscribe for events
    // subscribe to the shopping cart totalPrice
    this.shoppingCartService.totalPrice.subscribe(
      (data) => (this.totalPrice = data)
    );

    // subscribe to the shopping cart totalQuantity
    this.shoppingCartService.totalQuantity.subscribe(
      (data) => (this.totalQuantity = data)
    );
  }
}
