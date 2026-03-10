const axios = require("axios");
const urlJoin = require("url-join");
const config = require("../config/config");
const DsClient = require("../config/dsClient");
const iam = require('@docusign/iam-sdk');

const getAgreements = async (req) => {
  const accessToken = req.headers['authorization'].split(' ')[1];
  await DsClient.setAccessToken(accessToken);

  const userInfo = await DsClient.getUserInfo();
  const defaultAccount = userInfo.accounts.find(account => account.isDefault || account.isDefault === 'true');
  const accountId = defaultAccount ? defaultAccount.accountId : null;

  try {
    if (!accessToken) {
      throw new Error("Access token is missing. Please log in again.");
    }

    const client = DsClient.getAuthorizedClient();
    const agreements = await client.navigator.agreements.getAgreementsList({ accountId });

    if (!agreements.data || agreements.data.length === 0) {
      throw new Error("No agreements found");
    }

    return agreements.data;
  } catch (error) {
    console.error("Error fetching agreements from DocuSign:", error.message);
    throw error;
  }
};

const getAgreementById = async (req, agreementId) => {
  const accessToken = req.headers['authorization'].split(' ')[1];
  DsClient.setAccessToken(accessToken);

  const userInfo = await DsClient.getUserInfo(accessToken);
  const defaultAccount = userInfo.accounts.find(account => account.isDefault === 'true');
  const accountId = defaultAccount ? defaultAccount.accountId : null;

  try {
    if (!accessToken) {
      throw new Error("Access token is missing. Please log in again.");
    }

    const client = DsClient.getAuthorizedClient();
    const agreement = await client.navigator.agreements.getAgreement({ accountId, agreementId });

    if (!agreement) {
      throw new Error(`Agreement with ID ${agreementId} not found`);
    }

    return agreement;
  } catch (error) {
    console.error(
      `Error fetching agreement ${agreementId} from DocuSign:`,
      error.message
    );
    throw error;
  }
};

module.exports = {
  getAgreementById,
  getAgreements,
};
