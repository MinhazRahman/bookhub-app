import { Component, Inject, OnInit } from '@angular/core';
import { OKTA_AUTH } from '@okta/okta-angular';
import { OktaAuth } from '@okta/okta-auth-js';
import OktaSignIn from '@okta/okta-signin-widget';

import AppConfig from '../../config/app-config';
import appConfig from '../../config/app-config';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  // set a reference to okta sign in
  oktaSignIn: any;

  // inject OKTA_AUTH service
  constructor(@Inject(OKTA_AUTH) private oktaAuth: OktaAuth) {
    this.oktaSignIn = new OktaSignIn({
      logo: 'assets/images/logo.png',
      baseUrl: appConfig.oidc.issuer.split('/oauth2')[0],
      clientId: appConfig.oidc.clientId,
      redirectUri: appConfig.oidc.redirectUri,
      authParams: {
        pkce: true, // proof key for code exchange
        issuer: appConfig.oidc.issuer,
        scopes: appConfig.oidc.scopes,
      },
    });
  }

  ngOnInit(): void {
    // remove if any previous sign-in widget is rendered
    this.oktaSignIn.remove();

    // render the okta sign-in widget with the given id
    this.oktaSignIn.renderEl(
      {
        // this name must be same as div tag id in login.component.html
        el: '#okta-sign-in-widget',
      },
      (response: any) => {
        if (response.status === 'SUCCESS') {
          this.oktaAuth.signInWithRedirect();
        }
      },
      (error: any) => {
        throw error;
      }
    );
  }
}
