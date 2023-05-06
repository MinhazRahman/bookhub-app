/*
clientId: Public identifier for the client that is required for all OAuth flows.
issuer: Issuer of tokens, URL when authorizing with Okta Authorization server
redirectUri: After logging in Okta sends the users in this URI
scopes: Scopes provide information about a user, 
openid: required for authentication requests
profile: user's firstName, lastName, phone number etc
email: user's email address
*/
export default {
  oidc: {
    clientId: '0oa9f97k1iE3MeNvs5d7',
    issuer: 'https://dev-28014861.okta.com/oauth2/default',
    redirectUri: 'http://localhost:4200/login/callback',
    scopes: ['openid', 'profile', 'email'],
  },
};
