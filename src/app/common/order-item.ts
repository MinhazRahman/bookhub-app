import { ShoppingCartItem } from './shopping-cart-item';

export class OrderItem {
  imageUrl: string;
  unitPrice: number;
  quantity: number;
  bookId: number;

  constructor(shoppingCartItem: ShoppingCartItem) {
    this.imageUrl = shoppingCartItem.imageUrl;
    this.unitPrice = shoppingCartItem.unitPrice;
    this.quantity = shoppingCartItem.quantity;
    this.bookId = shoppingCartItem.id;
  }
}
