import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Country } from 'src/app/common/country';
import { State } from 'src/app/common/state';
import { UtilityFormService } from 'src/app/services/utility-form.service';

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

  // inject the form builder
  constructor(
    private formBuilder: FormBuilder,
    private utilityFormService: UtilityFormService
  ) {}

  ngOnInit(): void {
    // build the form
    this.checkoutFormGroup = this.formBuilder.group({
      customer: this.formBuilder.group({
        firstName: [''],
        lastName: [''],
        email: [''],
      }),

      shippingAddress: this.formBuilder.group({
        country: [''],
        street: [''],
        city: [''],
        state: [''],
        zipCode: [''],
      }),

      billingAddress: this.formBuilder.group({
        country: [''],
        street: [''],
        city: [''],
        state: [''],
        zipCode: [''],
      }),

      payWithCard: this.formBuilder.group({
        cardType: [''],
        nameOnCard: [''],
        cardNumber: [''],
        securityCode: [''],
        expirationMonth: [''],
        expirationYear: [''],
      }),
    });

    // populate credit card months
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

    // populate the countries when form is initially loaded
    this.utilityFormService
      .getCountries()
      .subscribe((data) => (this.countries = data));
  }

  onSubmit() {
    console.log('Handling customer form data..');
    console.log(this.checkoutFormGroup.get('customer')?.value);
    console.log(this.checkoutFormGroup.get('customer')?.value.email);
  }

  copyShippingAddressToBillingAddress(event: Event) {
    const isChecked = (<HTMLInputElement>event.target).checked;

    if (isChecked) {
      this.checkoutFormGroup.controls['billingAddress'].setValue(
        this.checkoutFormGroup.controls['shippingAddress'].value
      );
    } else {
      this.checkoutFormGroup.controls['billingAddress'].reset();
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
