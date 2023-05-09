import { Component, OnInit } from '@angular/core';
import { OrderHistory } from 'src/app/common/order-history';
import { OrderHistoryService } from 'src/app/services/order-history.service';

@Component({
  selector: 'app-order-history',
  templateUrl: './order-history.component.html',
  styleUrls: ['./order-history.component.css'],
})
export class OrderHistoryComponent implements OnInit {
  orderHistoryList: OrderHistory[] = [];
  // storage refers to the web browser's session storage
  storage: Storage = sessionStorage;

  constructor(private orderHistoryService: OrderHistoryService) {}

  ngOnInit(): void {
    this.handleOrderHistory();
  }

  handleOrderHistory() {
    // get the 'customerEmail' from the browser's storage
    const userEmail: string = JSON.parse(this.storage.getItem('userEmail')!);

    console.log('User Email: ' + userEmail);

    // retrieve the order history from the order history service
    this.orderHistoryService
      .getOrderHistory(userEmail)
      .subscribe((data) => (this.orderHistoryList = data.content));
  }
}
