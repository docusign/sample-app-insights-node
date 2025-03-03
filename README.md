
# Docusign Insights Sample App

The Insights Sample App showcases how the Navigator API (beta) can be used to get agreement details.

## Table of Contents
- [Prerequisites](#prerequisites)
- [Setup and Installation](#setup-and-installation)
- [Running the App](#running-the-app)
- [License](#license)

## Prerequisites

Before you begin, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (v14.x or later)
- [npm](https://www.npmjs.com/) (v6.x or later)
- A [Docusign developer account](https://www.docusign.com/developers/sandbox)

## Setup and Installation

1. Download or clone this repository to your workstation in a new folder named **sample-app-navigator-node**.
2. Navigate to that folder: **`cd sample-app-navigator-node`**
3. Navigate to the **client** folder: **`cd client`**
4. Install dependencies using the [npm](https://www.npmjs.com/) package manager: **`npm install`**
5. Navigate to the **server** folder: **`cd ../server`**
6. Install dependencies: **`npm install`**

### Create a new integration

1. If you don't already have one, create a [free developer account](https://www.docusign.com/developers/sandbox).
2. Log in to your developer account and navigate to [Apps and Keys](https://admindemo.docusign.com/apps-and-keys).
3. Select **Add App and Integration Key**.
4. Create a new integration that is configured to use **JSON Web Token (JWT) Grant** and **Authorization Code Grant (ACG)**.
    You will need the **integration key** itself and its **RSA key pair**. To use this application, you must add your application’s **Redirect URI** to your integration key. See our video, [**Creating an Integration Key for JWT Authentication**](https://www.youtube.com/watch?v=GgDqa7-L0yo) for a demonstration of how to create an integration key (client ID) for a user application like this example.
      - Save the **integration key** and **private RSA key pair** somewhere safe, as you will need these later.
5. Add the following redirect URIs for your app:
    - http://localhost:3000/ds/callback
    - http://localhost:8080/api/ds/callback
6. Rename the **.env.example** file in the root directory to **.env**, and update the file with the integration key and other settings.
  > **Note:** Protect your integration key and client secret. You should make sure that the **.env** file will not be stored in your source code repository.
7. Do the same with the **.env.example** file in the `server` directory.
8. Rename the **example.private.key** file in the `server/config` directory to **private.key**, and paste your complete private RSA key into this file (including the header and footer of the key). This should be the private RSA key you should have gotten when you created your integration key.


## Running the App

1. In one terminal, navigate to the server folder (cd server) and run **npm start**
2. In a separate terminal, navigate to the client folder (cd client) and run **npm start**
3. Open a browser to http://localhost:3000