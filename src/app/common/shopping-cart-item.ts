import { Book } from './book';

export class ShoppingCartItem {
  id: number;
  name: string;
  imageUrl: string;
  unitPrice: number;
  quantity: number;

  constructor(book: Book) {
    this.id = book.id;
    this.name = book.name;
    this.imageUrl = book.imageUrl;
    this.unitPrice = book.unitPrice;
    this.quantity = 1;
  }
}
