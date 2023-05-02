import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Country } from 'src/app/common/country';
import { State } from 'src/app/common/state';
import { UtilityFormService } from 'src/app/services/utility-form.service';
import { UtilityFormValidator } from 'src/app/validators/utility-form-validator';

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
        email: new FormControl('', [
          Validators.required,
          Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$'),
        ]),
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
    // touching all fields triggers the display of error messages
    if (this.checkoutFormGroup.invalid) {
      this.checkoutFormGroup.markAllAsTouched();
    }

    console.log(this.checkoutFormGroup.get('customer')?.value);
    console.log(this.checkoutFormGroup.get('customer')?.value.email);
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
