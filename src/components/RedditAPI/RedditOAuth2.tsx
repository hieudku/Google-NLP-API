const querystring = require('querystring');

const clientId = 'REACT_APP_REDDIT_CLIENT_ID';
const redirectUri = 'https://automatedcontenthub-hc.web.app/';
const state = 'random_string';
const scope = 'read';

const authorizationUrl = `https://www.reddit.com/api/v1/authorize?${querystring.stringify({
  client_id: clientId,
  response_type: 'code',
  state: state,
  redirect_uri: redirectUri,
  duration: 'permanent',
  scope: scope,
})}`;

console.log('Visit this URL to authorize:', authorizationUrl);