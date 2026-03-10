const iam = require('@docusign/iam-sdk');
const fs = require('fs');
const path = require('path');
const config = require('../config/config');

class DsClient {
  constructor() {
    this.apiClient = new iam.IamClient()
  }

  getUserInfo(){
    return this.apiClient.auth.getUserInfo();
  }

  getAuthorizationUrl() {
    try {
      const url = iam.AuthUtils.createAuthorizationUrl({
        clientId: config.docusign.clientId,
        scopes: config.scopes,
        redirectUri: config.docusign.redirectUri,
        type: config.responseType,
        state: config.state,
      });

      return url;
    } catch (error) {
      console.error('Failed to generate authorization URL:', error.message || error);
      throw new Error('Authorization URL generation failed. Please check the configuration and try again.');
    }
  }


  async exchangeCodeForToken(code) {
    try {
      return await this.apiClient.auth.getTokenFromConfidentialAuthCode({
        clientId: config.docusign.clientId,
        secretKey: config.docusign.clientSecret
      }, { code })
    } catch (error) {
      console.error('Error details:', error.response ? error.response.data : error.message);
      throw new Error(`Token exchange failed: ${error.message}`);
    }
  }

  async updateToken() {
    try {
      const rsaKey = fs.readFileSync(path.join(__dirname, '../config/private.key')).toString();
      const assertion = iam.AuthUtils.createJwtAssertion({
        clientId: config.docusign.clientId,
        userId: config.docusign.userId,
        scopes: config.scopes,
        privateKey: rsaKey,
      });
      const jwtResponse = await this.apiClient.auth.getTokenFromJwtGrant({ assertion });

      const accessToken = jwtResponse.accessToken;
      const expiresIn = jwtResponse.expiresIn;

      return { accessToken, expiresIn };
    } catch (error) {
      console.error('JWT updateToken error:', error.response ? error.response.data : error.message);
      throw new Error(`JWT update failed: ${error.message}`);
    }
  }

  setAccessToken(accessToken) {
    return new Promise((resolve, reject) => {
      this.apiClient = new iam.IamClient({ accessToken });
      resolve();
    })
  }

  getAuthorizedClient() {
    return this.apiClient;
  }
}


module.exports = new DsClient();
