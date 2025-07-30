const DsClient = require("../config/dsClient");
const iam = require('@docusign/iam-sdk');

const getAgreements = async (req) => {
  const accessToken = req.headers['authorization'].split(' ')[1];

  const userInfo = await DsClient.getUserInfo(accessToken);
  const defaultAccount = userInfo.accounts.find(account => account.isDefault === 'true');
  const accountId = defaultAccount ? defaultAccount.accountId : null;

  const client = new iam.IamClient({accessToken: accessToken });
  const agreements = await client.navigator.agreements.getAgreementsList({ accountId: accountId });

  return agreements.data;
};

const getAgreementById = async (req, agreementId) => {
  const accessToken = req.headers['authorization'].split(' ')[1];

  const userInfo = await DsClient.getUserInfo(accessToken);
  const defaultAccount = userInfo.accounts.find(account => account.isDefault === 'true');
  const accountId = defaultAccount ? defaultAccount.accountId : null;

  const client = new iam.IamClient({ accessToken: accessToken });
  const agreements = await client.navigator.agreements.getAgreement({ accountId: accountId, agreementId: agreementId });
  return agreements;
};

module.exports = {
  getAgreementById,
  getAgreements,
};
