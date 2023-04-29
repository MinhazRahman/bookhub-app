import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css'],
})
export class SearchComponent implements OnInit {
  // inject Router
  constructor(private router: Router) {}

  ngOnInit(): void {}

  // route the data to the 'search' route
  // it will be handled by BookListComponent
  searchBook(value: string) {
    this.router.navigateByUrl(`/search/${value}`);
  }
}
