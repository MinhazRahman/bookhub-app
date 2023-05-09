import { Injector, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { BookListComponent } from './components/book-list/book-list.component';
import { HttpClientModule } from '@angular/common/http';
import { BookService } from './services/book.service';
import { Routes, RouterModule, Router } from '@angular/router';
import { BookCategoryMenuComponent } from './components/book-category-menu/book-category-menu.component';
import { SearchComponent } from './components/search/search.component';
import { BookDetailsComponent } from './components/book-details/book-details.component';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ShoppingCartStatusComponent } from './components/shopping-cart-status/shopping-cart-status.component';
import { ShoppingCartDetailsComponent } from './components/shopping-cart-details/shopping-cart-details.component';
import { CheckoutComponent } from './components/checkout/checkout.component';
import { ReactiveFormsModule } from '@angular/forms';
import { LoginComponent } from './components/login/login.component';
import { LoginStatusComponent } from './components/login-status/login-status.component';

import {
  OktaCallbackComponent,
  OKTA_CONFIG,
  OktaAuthGuard,
} from '@okta/okta-angular';

import { OktaAuthModule } from '@okta/okta-angular';

import { OktaAuth } from '@okta/okta-auth-js';
import appConfig from './config/app-config';
import { CustomerAccountsPageComponent } from './components/customer-accounts-page/customer-accounts-page.component';
import { OrderHistoryComponent } from './components/order-history/order-history.component';

const oktaConfig = appConfig.oidc;
const oktaAuth = new OktaAuth(oktaConfig);

// sendToLoginPage method redirect the user to the custom login page
// because we don't want to use the default login page provided by Okta
function sendToLoginPage(oktaAuth: OktaAuth, injector: Injector) {
  // use injector to access any service available within the application
  const router = injector.get(Router);

  // redirect the user to the custom login page
  router.navigate(['/login']);
}

/*
 * sets up routes constant where you define your routes.
 * when path matches it creates new instance of component.
 * OktaAuthGuard: Route Guard, if authenticated give access to route otherwise send to login page
 */
const routes: Routes = [
  {
    path: 'orders',
    component: OrderHistoryComponent,
    canActivate: [OktaAuthGuard],
    data: { onAuthRequired: sendToLoginPage },
  },

  {
    path: 'accounts',
    component: CustomerAccountsPageComponent,
    canActivate: [OktaAuthGuard],
    data: { onAuthRequired: sendToLoginPage },
  },

  { path: 'login/callback', component: OktaCallbackComponent },
  { path: 'login', component: LoginComponent },

  { path: 'checkout', component: CheckoutComponent },
  { path: 'shopping-cart-details', component: ShoppingCartDetailsComponent },
  { path: 'books/:id', component: BookDetailsComponent },
  { path: 'search/:keyword', component: BookListComponent },
  { path: 'category/:id/:name', component: BookListComponent },
  { path: 'category', component: BookListComponent },
  { path: 'books', component: BookListComponent },
  { path: '', redirectTo: '/books', pathMatch: 'full' },
  { path: '**', redirectTo: '/books', pathMatch: 'full' },
];

// configures NgModule imports and exports
@NgModule({
  declarations: [
    AppComponent,
    BookListComponent,
    BookCategoryMenuComponent,
    SearchComponent,
    BookDetailsComponent,
    ShoppingCartStatusComponent,
    ShoppingCartDetailsComponent,
    CheckoutComponent,
    LoginComponent,
    LoginStatusComponent,
    CustomerAccountsPageComponent,
    OrderHistoryComponent,
  ],
  imports: [
    RouterModule.forRoot(routes),
    BrowserModule,
    HttpClientModule,
    NgbModule,
    ReactiveFormsModule,
    OktaAuthModule,
  ],
  providers: [BookService, { provide: OKTA_CONFIG, useValue: { oktaAuth } }],
  bootstrap: [AppComponent],
})
export class AppModule {}
