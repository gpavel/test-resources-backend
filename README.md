# Foleon Assessment - Backend

This is a Node.js + TypeScript implementation of backend part for the Foleon assessment, which serves as proxy between client side and Foleon API. The proxy is used to preven exposing the Client ID and Client Secret pair as well as the authentication token.

## Setup

1. Run `setup` script:

The script installs npm depdendencies (`node_modules`) builds the application.

   ```sh
   npm run setup
   ```

## Configure

Create a `.env` file in the root folder with the following variables or just add them as environment variables when launching the application:

1. Mandatory variables:

   - `FOLEON_CLIENT_ID`;
   - `FOLEON_CLIENT_SECRET`;
   - `FRONTEND_URL` - the list of URLs, that should be added to CORS whitelist;

1. Optional variables:

   - `FOLEON_OAUTH_URL` - the URL which will be used for Foleon API authentication and authorization. Default: ``.
   - `PORT` - the port which will be used for launching HTTP server;
