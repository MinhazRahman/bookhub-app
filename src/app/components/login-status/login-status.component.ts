import { Component, Inject, OnInit } from '@angular/core';
import { OKTA_AUTH, OktaAuthStateService } from '@okta/okta-angular';
import { OktaAuth } from '@okta/okta-auth-js';

@Component({
  selector: 'app-login-status',
  templateUrl: './login-status.component.html',
  styleUrls: ['./login-status.component.css'],
})
export class LoginStatusComponent implements OnInit {
  isAuthenticated: boolean = false;
  userFullName: string = '';
  userGivenName: string = '';
  userFamilyName: string = '';

  // inject OktaAuthStateService
  constructor(
    private oktaAuthService: OktaAuthStateService,
    @Inject(OKTA_AUTH) private oktaAuth: OktaAuth
  ) {}

  ngOnInit(): void {
    // subscribe to authentication state changes
    this.oktaAuthService.authState$.subscribe((result) => {
      this.isAuthenticated = result.isAuthenticated!;
      this.getUserDetails();
    });
  }

  getUserDetails() {
    // fetch the logged in user details
    // full user name is exposed as a property name
    this.oktaAuth.getUser().then((result) => {
      this.userFullName = result.name as string;
      this.userGivenName = result.given_name as string;
      this.userFamilyName = result.family_name as string;
    });
  }

  logout() {
    // terminates the session with okta and removes the current tokens
    this.oktaAuth.signOut();
  }
}
