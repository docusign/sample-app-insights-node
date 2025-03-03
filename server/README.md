
# Insights Sample App

This project is a **Sample Application** showcasing the use of **DocuSign Navigator API**. The application demonstrates how to authenticate using OAuth Code Grant flow, fetch user agreements, and verify users using the DocuSign API.

## Table of Contents
- [Prerequisites](#prerequisites)
- [Setup and Installation](#setup-and-installation)
- [Configuration](#configuration)
- [Available Endpoints](#available-endpoints)
- [Running the App](#running-the-app)
- [Project Structure](#project-structure)
- [License](#license)

## Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v14.x or later)
- **npm** (v6.x or later)
- A **DocuSign Developer Account** to generate OAuth credentials

## Setup and Installation

1. **Clone the repository**:

   ```bash
   git clone https://github.com/your-username/sample-app-navigator-node.git
   cd sample-app-navigator-node
   ```

2. **Install the dependencies**:

   ```bash
   npm install
   ```

3. **Environment Variables**: Create a `.env` file in the root of your project and configure it with your DocuSign credentials:

   ```
   DOCUSIGN_CLIENT_ID=your_client_id
   DOCUSIGN_CLIENT_SECRET=your_client_secret
   DOCUSIGN_REDIRECT_URI=http://localhost:8080/ds/callback
   DOCUSIGN_AUTH_SERVER=https://account-d.docusign.com
   ```

## Configuration

The project uses a configuration file `config/config.js`. You can update this file to match your DocuSign setup, or use the `.env` file as shown above.

Example configuration:

```javascript
module.exports = {
  docusign: {
    clientId: process.env.DOCUSIGN_CLIENT_ID,
    clientSecret: process.env.DOCUSIGN_CLIENT_SECRET,
    redirectUri: process.env.DOCUSIGN_REDIRECT_URI,
    authServer: process.env.DOCUSIGN_AUTH_SERVER,
  },
  server: {
    sessionSecret: process.env.SESSION_SECRET || 'default-secret',
  },
  port: process.env.PORT || 8080,
};
```

## Available Endpoints

### 1. **Authentication and Callback**
- `GET /ds/callback` - Receives the OAuth authorization code and exchanges it for an access token.

### 2. **Agreements**
- `GET /agreements` - Fetches all agreements (mock data).
- `GET /agreements/:id` - Fetches a specific agreement by ID (mock data).

### 3. **Health Check**
- `GET /healthcheck` - Verifies that the server is running correctly.

## Running the App

To start the application, run:

```bash
npm start
```

The server will start and run on the specified port (default: 8080). You can change the port in the `config.js` file or `.env` file.

## Project Structure

```
/navigator-api-sample-app
│
├── /config           # Configuration files for the app
│   └── config.js
│
├── /controllers      # Route handler files
│   ├── auth.js
│   └── agreements.js
│
├── /middlewares      # Middleware files for request processing
│   └── authMiddleware.js
│
├── /services         # Business logic and utility files
│   └── docusignService.js
│
├── /mockData         # Mock data for the agreements
│   └── agreementDocuments.json
│
├── router.js         # Main application routing file
│
├── app.js            # Express.js app configuration
│
├── .env              # Environment variables configuration
│
└── README.md         # Project documentation
```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
