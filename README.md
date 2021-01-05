# Foleon Assessment - Backend

This is a Node.js + TypeScript implementation of the backend part for the Foleon assessment, which serves as proxy between the client side and Foleon API. The proxy is used to prevent exposing the Foleon API credentials.

## Setup

1. Run `setup` script:

The script installs npm dependencies (`node_modules`) builds the application.

   ```sh
   npm run setup
   ```

## Configure

Create a `.env` file in the root folder with the following variables or just add them as environment variables when launching the application:

1. Mandatory variables:

   - `FOLEON_CLIENT_ID`;
   - `FOLEON_CLIENT_SECRET`;
   - `CLIENT_ORIGIN` - the list of URLs, that should be added to CORS whitelist;

1. Optional variables:

   - `FOLEON_OAUTH_URL` - the URL which will be used for Foleon API authentication and authorization. Default: ``.
   - `PORT` - the port which will be used for launching HTTP server;

Variables priority (from highest to lowest):

1. all the environment variables;
1. the variables from `.env`;
1. the variables from `default.env`.

## Launch

Use Node.js to launch `dist/main.js` or just type `npm start` in console.
