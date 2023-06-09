import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Purchase } from '../common/purchase';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { PaymentInfo } from '../common/payment-info';

@Injectable({
  providedIn: 'root',
})
export class CheckoutService {
  private purchaseUrl = environment.bookHubApiUrl + '/checkout/purchase';
  private paymentIntentUrl = environment.bookHubApiUrl + '/checkout/payment-intent';

  constructor(private httpClient: HttpClient) {}

  /*
   * placeOrder method sends an HTTP POST request to the server to place an order for a purchase.
   * It takes in a Purchase object as an argument and returns an Observable of any type.
   */
  placeOrder(purchase: Purchase): Observable<any> {
    return this.httpClient.post<Purchase>(this.purchaseUrl, purchase);
  }

  createPaymentIntent(paymentInfo: PaymentInfo): Observable<any> { 
    return this.httpClient.post<PaymentInfo>(this.paymentIntentUrl, paymentInfo);
  }
}
