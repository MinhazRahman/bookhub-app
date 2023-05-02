import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Country } from '../common/country';
import { State } from '../common/state';

@Injectable({
  providedIn: 'root',
})
export class UtilityFormService {
  private countriesUrl = 'http://localhost:8080/bookhub/countries';
  private statesUrl = 'http://localhost:8080/bookhub/states';

  constructor(private httpClient: HttpClient) {}

  getCreditCardMonths(startMonth: number): Observable<number[]> {
    let data: number[] = [];

    // build an array for Month dropdown list
    // start at the current month and loop until 12
    for (let theMonth = startMonth; theMonth <= 12; theMonth++) {
      data.push(theMonth);
    }

    // 'of' operator from 'rxjs' will wrap 'data' as an Observable
    return of(data);
  }

  getCreditCardYears(): Observable<number[]> {
    let data: number[] = [];

    // build an array for Year dropdown list
    // start at the current year and loop through 10 next year
    let startYear: number = new Date().getFullYear();
    let endYear: number = startYear + 10;

    for (let theYear = startYear; theYear <= endYear; theYear++) {
      data.push(theYear);
    }

    return of(data);
  }

  getCountries(): Observable<Country[]> {
    return this.httpClient.get<Country[]>(this.countriesUrl);
  }

  // get the list of States by country code
  getStates(theCountryCode: string): Observable<State[]> {
    // build the url to get the list of states by country code
    const searchStatesUrl = `${this.statesUrl}/findByCountryCode/${theCountryCode}`;
    return this.httpClient.get<State[]>(searchStatesUrl);
  }
}
