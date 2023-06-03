import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Order } from '../common/order';
import { OrderHistory } from '../common/order-history';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class OrderHistoryService {
  private orderUrl = environment.bookHubApiUrl + '/orders';

  constructor(private httpClient: HttpClient) {}

  getOrderHistory(customerEmail: String): Observable<GetResponseOrderHistory> {
    // build the url based of customer email
    const orderHistoryUrl = `${this.orderUrl}/findByCustomerEmail/${customerEmail}`;
    return this.httpClient.get<GetResponseOrderHistory>(orderHistoryUrl);
  }
}

// extract the JSON array from the Spring data REST json response
interface GetResponseOrderHistory {
  content: OrderHistory[];
}
