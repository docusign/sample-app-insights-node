const DsClient = require("../config/dsClient");
const iam = require('@docusign/iam-sdk');

const getAgreements = async (req) => {
  const accessToken = req.headers['authorization'].split(' ')[1];

  const userInfo = await DsClient.getUserInfo(accessToken);
  const defaultAccount = userInfo.accounts.find(account => account.isDefault === 'true');
  const accountId = defaultAccount ? defaultAccount.accountId : null;

  try {
    if (!accessToken) {
      throw new Error("Access token is missing. Please log in again.");
    }

    const client = new iam.IamClient({accessToken: accessToken });
    const agreements = await client.navigator.agreements.getAgreementsList({ accountId: accountId });

    if (agreements.data) {
      return  agreements.data;
    } else {
      throw new Error("No agreements found");
    }
  } catch (error) {
    console.error("Error fetching agreements from DocuSign:", error.message);
    throw error;
  }
};

const getAgreementById = async (req, agreementId) => {
  const accessToken = req.headers['authorization'].split(' ')[1];

  const userInfo = await DsClient.getUserInfo(accessToken);
  const defaultAccount = userInfo.accounts.find(account => account.isDefault === 'true');
  const accountId = defaultAccount ? defaultAccount.accountId : null;

  try {
    if (!accessToken) {
      throw new Error("Access token is missing. Please log in again.");
    }

    const client = new iam.IamClient({ accessToken: accessToken });
    const agreements = await client.navigator.agreements.getAgreement({ accountId: accountId, agreementId: agreementId });

    if (agreements) {
      return agreements;
    } else {
      throw new Error(`Agreement with ID ${agreementId} not found`);
    }
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
