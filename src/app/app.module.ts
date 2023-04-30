import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { BookListComponent } from './components/book-list/book-list.component';
import { HttpClientModule } from '@angular/common/http';
import { BookService } from './services/book.service';
import { Routes, RouterModule } from '@angular/router';
import { BookCategoryMenuComponent } from './components/book-category-menu/book-category-menu.component';
import { SearchComponent } from './components/search/search.component';
import { BookDetailsComponent } from './components/book-details/book-details.component'; // CLI imports router

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ShoppingCartStatusComponent } from './components/shopping-cart-status/shopping-cart-status.component';
import { ShoppingCartDetailsComponent } from './components/shopping-cart-details/shopping-cart-details.component';

// sets up routes constant where you define your routes
// when path matches it creates new instance of component
const routes: Routes = [
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
  ],
  imports: [
    RouterModule.forRoot(routes),
    BrowserModule,
    HttpClientModule,
    NgbModule,
  ],
  providers: [BookService],
  bootstrap: [AppComponent],
})
export class AppModule {}
