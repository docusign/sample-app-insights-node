const DsClient = require("../config/dsClient");
const config = require("../config/config");

const startAuth = (req, res) => {
  const authorizationUrl = DsClient.getAuthorizationUrl();

  res.redirect(authorizationUrl);
};

const callBackController = async (req, res) => {
  const code = req.query.code;
  if (!code) {
    return res.status(400).send("Authorization code not found in the request.");
  }

  try {
    const authData = await DsClient.exchangeCodeForToken(code);

    DsClient.setAccessToken(authData.accessToken);

    req.session.accessToken = authData.accessToken;
    req.session.refreshToken = authData.refreshToken;
    req.session.expiresIn = authData.expiresIn;

    req.session.authType = "Code Grant";
  
    req.session.save((err) => {
      if (err) {
        console.error("Error saving session:", err);
        return res.status(500).json({ message: "Session save failed" });
      }

      let url = `${config.client.port}/auth-callback?access_token=${authData.accessToken}&refresh_token=${authData.refreshToken}&expires_in=${authData.expiresIn}`;
      url = url.replace(/\/api\/ds/g, "");

      res.redirect(url);
    });
  } catch (error) {
    console.error("Callback error:", error);
    res.status(500).json({ message: "Login failed", error: error.message });
  }
};

const jwtAuth = async (req, res) => {
  try {
    const authData = await DsClient.updateToken();

    DsClient.setAccessToken(authData.accessToken);

    req.session.accessToken = authData.accessToken;
    req.session.expiresIn = authData.expiresIn;
    req.session.authType = "JWT";

    res.json({
      message: "Logged in with JWT",
      accessToken: authData.accessToken,
      expiresIn: authData.expiresIn,
    });
  } catch (error) {
    console.error("JWT authorization error:", error);
    res.status(500).json({ message: `JWT authorization failed: ${error}` });
  }
};

const getStatus = (req, res) => {
  const isTokenValid =
    req.session.expiresIn && Date.now() < req.session.expiresIn * 1000;
  res.json({
    logged: isTokenValid,
    authType: req.session.authType || null,
  });
};

const logOut = (req, res) => {
  try {
    req.session.accessToken = null;
    req.session.refreshToken = null;
    req.session.expiresIn = null;
    req.session.authType = null;

    req.session.save((err) => {
      if (err) {
        console.error("Logout save error:", err);
        return res.status(500).json({ message: "Logout save failed" });
      }
      res.json({ message: "Logged out successfully, session cleared" });
    });
  } catch (error) {
    console.error("Unexpected error during logout");
    res.status(500).json({ message: "Unexpected error during logout" });
  }
};

module.exports = {
  startAuth,
  callBackController,
  jwtAuth,
  getStatus,
  logOut,
};
