import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Purchase } from '../common/purchase';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CheckoutService {
  private purchaseUrl = 'http://localhost:8080/bookhub/checkout/purchase';

  constructor(private httpClient: HttpClient) {}

  /*
   * placeOrder method sends an HTTP POST request to the server to place an order for a purchase.
   * It takes in a Purchase object as an argument and returns an Observable of any type.
   */
  placeOrder(purchase: Purchase): Observable<any> {
    return this.httpClient.post<Purchase>(this.purchaseUrl, purchase);
  }
}