import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { Country } from 'src/app/common/country';
import { Order } from 'src/app/common/order';
import { OrderItem } from 'src/app/common/order-item';
import { PaymentInfo } from 'src/app/common/payment-info';
import { Purchase } from 'src/app/common/purchase';
import { State } from 'src/app/common/state';
import { CheckoutService } from 'src/app/services/checkout.service';
import { ShoppingCartService } from 'src/app/services/shopping-cart.service';
import { UtilityFormService } from 'src/app/services/utility-form.service';
import { UtilityFormValidator } from 'src/app/validators/utility-form-validator';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css'],
})
export class CheckoutComponent implements OnInit {
  // declare form group
  checkoutFormGroup!: FormGroup;

  totalPrice: number = 0;
  totalQuantity: number = 0;

  creditCardMonths: number[] = [];
  creditCardYears: number[] = [];

  countries: Country[] = [];
  shippingAddressStates: State[] = [];
  billingAddressStates: State[] = [];

  // storage refers to the browser's session storage
  storage: Storage = sessionStorage;

  // initialize Stripe API
  stripe = Stripe(environment.stripePublishableKey);

  paymentInfo: PaymentInfo = new PaymentInfo();
  cardElement: any;
  displayError: any = '';

  isDisabled: boolean = false;

  // inject the form builder
  constructor(
    private formBuilder: FormBuilder,
    private utilityFormService: UtilityFormService,
    private shoppingCartService: ShoppingCartService,
    private checkoutService: CheckoutService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // set up Stripe payment form
    this.setupStripePaymentForm();

    // get the totalPrice and totalQuantity
    this.reviewShoppingCartDetails();

    // retrieve the user's email address from the browser's storage
    const userEmail: string = JSON.parse(this.storage.getItem('userEmail')!);

    // build the form
    this.checkoutFormGroup = this.formBuilder.group({
      customer: this.formBuilder.group({
        firstName: new FormControl('', [
          Validators.required,
          Validators.minLength(2),
          UtilityFormValidator.notOnlyWhitespace,
        ]),
        lastName: new FormControl('', [
          Validators.required,
          Validators.minLength(2),
          UtilityFormValidator.notOnlyWhitespace,
        ]),
        email: new FormControl(userEmail, [
          Validators.required,
          Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$'),
        ]),
      }),

      shippingAddress: this.formBuilder.group({
        country: new FormControl('', [Validators.required]),
        street: new FormControl('', [
          Validators.required,
          Validators.minLength(2),
          UtilityFormValidator.notOnlyWhitespace,
        ]),
        city: new FormControl('', [
          Validators.required,
          Validators.minLength(2),
          UtilityFormValidator.notOnlyWhitespace,
        ]),
        state: new FormControl('', [Validators.required]),
        zipCode: new FormControl('', [
          Validators.required,
          Validators.minLength(5),
          UtilityFormValidator.notOnlyWhitespace,
        ]),
      }),

      billingAddress: this.formBuilder.group({
        country: new FormControl('', [Validators.required]),
        street: new FormControl('', [
          Validators.required,
          Validators.minLength(2),
          UtilityFormValidator.notOnlyWhitespace,
        ]),
        city: new FormControl('', [
          Validators.required,
          Validators.minLength(2),
          UtilityFormValidator.notOnlyWhitespace,
        ]),
        state: new FormControl('', [Validators.required]),
        zipCode: new FormControl('', [
          Validators.required,
          Validators.minLength(5),
          UtilityFormValidator.notOnlyWhitespace,
        ]),
      }),

      payWithCard: this.formBuilder.group({
        /*
        cardType: new FormControl('', [
          Validators.required,
          UtilityFormValidator.notOnlyWhitespace,
        ]),
        nameOnCard: new FormControl('', [
          Validators.required,
          Validators.minLength(2),
          UtilityFormValidator.notOnlyWhitespace,
        ]),
        cardNumber: new FormControl('', [
          Validators.required,
          Validators.pattern('[0-9]{16}'),
          UtilityFormValidator.notOnlyWhitespace,
        ]),
        securityCode: new FormControl('', [
          Validators.required,
          Validators.pattern('[0-9]{3}'),
          UtilityFormValidator.notOnlyWhitespace,
        ]),
        expirationMonth: [''],
        expirationYear: [''],
        */
      }),
    });

    // populate credit card months
    /*
    const startMonth: number = new Date().getMonth() + 1; // months are 0-based that's why add 1 to the month
    // call getCreditCardMonths() method, subscribe to the call and initialize creditCardMonths
    this.utilityFormService
      .getCreditCardMonths(startMonth)
      .subscribe((data) => (this.creditCardMonths = data));

    // populate credit card years
    const startYear: number = new Date().getFullYear();
    this.utilityFormService
      .getCreditCardYears()
      .subscribe((data) => (this.creditCardYears = data));
    */

    // populate the countries when form is initially loaded
    this.utilityFormService
      .getCountries()
      .subscribe((data) => (this.countries = data));
  }

  setupStripePaymentForm() {
    // get a handle to stripe elements
    let elements = this.stripe.elements();

    // create a card element and hide the zip code field
    this.cardElement = elements.create('card', { hidePostalCode: true });

    // add and instance of card UI component into the 'card-element' div
    this.cardElement.mount('#card-element');

    // add event binding for the 'change' event on the card element
    this.cardElement.on('change', (event: any) => {
      // get a handle to card-errors element
      this.displayError = document.getElementById('card-errors');

      if (event.complete) {
        this.displayError.textContent = '';
      } else if (event.error) {
        // show the validation error to the user
        this.displayError.textContent = event.error.message;
      }
    });
  }

  reviewShoppingCartDetails() {
    // subscribe to totalPrice
    this.shoppingCartService.totalPrice.subscribe(
      (totalQuantity) => (this.totalPrice = totalQuantity)
    );
    // subscribe to totalQuantity
    this.shoppingCartService.totalQuantity.subscribe(
      (totalQuantity) => (this.totalQuantity = totalQuantity)
    );
  }

  /*
   * 'Place Order' button is a submit button
   * When 'Place Order' button is clicked 'onSubmit' method is invoked
   */
  onSubmit() {
    console.log('Handling customer form data..');
    // touching all fields triggers the display of error messages
    if (this.checkoutFormGroup.invalid) {
      this.checkoutFormGroup.markAllAsTouched();
      return;
    }

    // set up order
    let order = new Order();
    order.totalPrice = this.totalPrice;
    order.totalQuantity = this.totalQuantity;

    // get shopping cart items
    const shoppingCartItems = this.shoppingCartService.shoppingCartItems;

    // create an array of orderItems from the array of shoppingCartItems
    let orderItems: OrderItem[] = shoppingCartItems.map(
      (shoppingCartItem) => new OrderItem(shoppingCartItem)
    );

    // set up purchase by first creating a Purchase object and adding values to it
    let purchase: Purchase = new Purchase();

    // populate purchase with customer
    purchase.customer = this.checkoutFormGroup.controls['customer'].value;

    // populate purchase with shipping address
    purchase.shippingAddress =
      this.checkoutFormGroup.controls['shippingAddress'].value;
    const shippingCountry: Country = JSON.parse(
      JSON.stringify(purchase.shippingAddress.country)
    );
    const shippingState: State = JSON.parse(
      JSON.stringify(purchase.shippingAddress.state)
    );
    purchase.shippingAddress.country = shippingCountry.name;
    purchase.shippingAddress.state = shippingState.name;

    // populate purchase with billing address
    purchase.billingAddress =
      this.checkoutFormGroup.controls['billingAddress'].value;
    const billingCountry: Country = JSON.parse(
      JSON.stringify(purchase.billingAddress.country)
    );
    const billingState: State = JSON.parse(
      JSON.stringify(purchase.billingAddress.state)
    );
    purchase.billingAddress.country = billingCountry.name;
    purchase.billingAddress.state = billingState.name;

    // populate purchase with order
    purchase.order = order;

    // populate purchase with orderItems
    purchase.orderItems = orderItems;

    // compute payment info
    this.paymentInfo.amount = Math.round(this.totalPrice * 100);
    this.paymentInfo.currency = 'USD';

    // if valid form then
    // - create payment intent
    // - confirm card payment
    // - place order
    if (
      !this.checkoutFormGroup.invalid &&
      this.displayError.textContent === ''
    ) {
      this.isDisabled = true;

      this.checkoutService
        .createPaymentIntent(this.paymentInfo)
        .subscribe((paymentIntentResponse) => {
          this.stripe
            .confirmCardPayment(
              paymentIntentResponse.client_secret,
              {
                payment_method: {
                  // reference the Stripe Elements component: cardElement
                  card: this.cardElement,
                  billing_details: {
                    email: purchase.customer.email,
                    name: `${purchase.customer.firstName} ${purchase.customer.lastName}`,
                    address: {
                      line1: purchase.billingAddress.street,
                      city: purchase.billingAddress.city,
                      state: purchase.billingAddress.state,
                      postal_code: purchase.billingAddress.zipCode,
                      country: this.billingAddressCountry?.value.code,
                    },
                  },
                },
              },
              { handleActions: false }
            )
            .then((result: any) => {
              if (result.error) {
                // display the error
                alert(`There was an error: ${result.error.message}`);
                this.isDisabled = false;
              } else {
                // call the REST API through the CheckoutService
                this.checkoutService.placeOrder(purchase).subscribe({
                  next: (response: any) => {
                    alert(
                      `Your order has been received. \nOrder tracking number: ${response.orderTrackingNumber}`
                    );
                    // reset the cart
                    this.resetShoppingCart();
                    this.isDisabled = false;
                  },
                  error: (err: any) => {
                    alert(`There was an error: ${err.message}`);
                    this.isDisabled = false;
                  },
                });
              }
            });
        });
    } else {
      this.checkoutFormGroup.markAllAsTouched();
      return;
    }
  }

  // reset the shopping cart
  resetShoppingCart() {
    // reset the shopping cart data
    this.shoppingCartService.shoppingCartItems = [];
    this.shoppingCartService.totalPrice.next(0);
    this.shoppingCartService.totalQuantity.next(0);
    this.shoppingCartService.persistShoppingCartItems();

    // reset the form
    this.checkoutFormGroup.reset();

    // go back to the books page
    this.router.navigateByUrl('/books');
  }

  // getter methods to access form controls
  get firstName() {
    return this.checkoutFormGroup.get('customer.firstName');
  }

  get lastName() {
    return this.checkoutFormGroup.get('customer.lastName');
  }

  get email() {
    return this.checkoutFormGroup.get('customer.email');
  }

  get shippingAddressCountry() {
    return this.checkoutFormGroup.get('shippingAddress.country');
  }
  get shippingAddressStreet() {
    return this.checkoutFormGroup.get('shippingAddress.street');
  }
  get shippingAddressCity() {
    return this.checkoutFormGroup.get('shippingAddress.city');
  }
  get shippingAddressState() {
    return this.checkoutFormGroup.get('shippingAddress.state');
  }
  get shippingAddressZipCode() {
    return this.checkoutFormGroup.get('shippingAddress.zipCode');
  }

  get billingAddressCountry() {
    return this.checkoutFormGroup.get('billingAddress.country');
  }
  get billingAddressStreet() {
    return this.checkoutFormGroup.get('billingAddress.street');
  }
  get billingAddressCity() {
    return this.checkoutFormGroup.get('billingAddress.city');
  }
  get billingAddressState() {
    return this.checkoutFormGroup.get('billingAddress.state');
  }
  get billingAddressZipCode() {
    return this.checkoutFormGroup.get('billingAddress.zipCode');
  }

  get payWithCardCardType() {
    return this.checkoutFormGroup.get('payWithCard.cardType');
  }

  get payWithCardNameOnCard() {
    return this.checkoutFormGroup.get('payWithCard.nameOnCard');
  }

  get payWithCardCardNumber() {
    return this.checkoutFormGroup.get('payWithCard.cardNumber');
  }

  get payWithCardSecurityCode() {
    return this.checkoutFormGroup.get('payWithCard.securityCode');
  }

  get payWithCardExpirationMonth() {
    return this.checkoutFormGroup.get('payWithCard.expirationMonth');
  }

  get payWithCardExpirationYear() {
    return this.checkoutFormGroup.get('payWithCard.expirationYear');
  }

  // when customer mark the check box on the Form
  copyShippingAddressToBillingAddress(event: Event) {
    const isChecked = (<HTMLInputElement>event.target).checked;

    if (isChecked) {
      this.checkoutFormGroup.controls['billingAddress'].setValue(
        this.checkoutFormGroup.controls['shippingAddress'].value
      );

      // copy shippingAddressStates to billingAddressStates array
      this.billingAddressStates = this.shippingAddressStates;
    } else {
      this.checkoutFormGroup.controls['billingAddress'].reset();
      // reset the billingAddressStates
      this.billingAddressStates = [];
    }
  }

  handleMonthsAndYears() {
    const payWithCardFormGroup = this.checkoutFormGroup.get('payWithCard')!;

    const currentYear: number = new Date().getFullYear();
    const selectedYear: number = Number(
      payWithCardFormGroup.value.expirationYear
    );

    // if current year equals the selected year, then start with the current month
    let startMonth: number;
    if (currentYear === selectedYear) {
      startMonth = new Date().getMonth() + 1;
    } else {
      startMonth = 1;
    }

    // get the credit card months
    this.utilityFormService
      .getCreditCardMonths(startMonth)
      .subscribe((data) => (this.creditCardMonths = data));
  }

  // retrieve the states based on the country selected on the HTML form template
  getStates(theFormGroupName: string) {
    const theFormGroup = this.checkoutFormGroup.get(theFormGroupName);

    const countryCode = theFormGroup?.value.country.code;
    const countryName = theFormGroup?.value.country.name;

    this.utilityFormService.getStates(countryCode).subscribe((data) => {
      if (theFormGroupName === 'shippingAddress') {
        this.shippingAddressStates = data;
      } else {
        this.billingAddressStates = data;
      }

      // select the first state by default
      theFormGroup?.get('state')?.setValue(data[0]);
    });
  }
}
