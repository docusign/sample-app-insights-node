require('dotenv').config();



module.exports = {
  port: process.env.PORT,
  docusign: {
    baseURL: 'https://account-d.docusign.com',
    oauthBasePath: 'account-d.docusign.com',
    clientId: process.env.DS_CLIENT_ID,
    clientSecret: process.env.DS_CLIENT_SECRET,
    userId: process.env.DS_IMPERSONATED_USER_ID, 
    accountId: process.env.DS_ACCOUNT_ID,
    authServer: process.env.DS_AUTH_SERVER,
    privateKeyPath: process.env.DS_PRIVATE_KEY_PATH,
    redirectUri: process.env.DS_REDIRECT_URI,
    tokenUrl:  process.env.TOKEN_URL,
    agreementsUrl:`https://api-d.docusign.com/v1/accounts/`,
  },
  server: {
    sessionSecret: process.env.SESSION_SECRET || 'default-secret'
  },
  client : {
    port: process.env.CLIENT_URL
  },
  scopes: ['adm_store_unified_repo_read', 'signature'],
  responseType:'code',
  state: 'random_state_string'
};
