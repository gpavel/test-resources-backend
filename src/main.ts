import express from 'express';
import path from 'path';
import { config } from 'dotenv';

import { FoleonAuthManager } from './utils/FoleonTokenManager';
import { ExpressProxyController } from './controllers/AuthProxyController';

const DEFAULT_PORT = 3000;

function initializeDefaultConfig(): Record<string, any>  {
  return config({ path: path.resolve(__dirname + '../.env.default') }).parsed ?? {};
}

function initializeUserConfig(): Record<string, any> {
  return config().parsed ?? {};
}

export function main(): void {
  const configuration = {
    ...initializeDefaultConfig(),
    ...initializeUserConfig(),
  };

  const app = express();
  const port = configuration?.PORT ?? DEFAULT_PORT;

  const tokenManager = new FoleonAuthManager(
    configuration?.FOLEON_OAUTH_URL as string,
    configuration?.FOLEON_CLIENT_ID as string,
    configuration?.FOLEON_CLIENT_SECRET as string,
  );

  const controller = new ExpressProxyController(
    tokenManager,
  );

  app.use('/publications', controller.proxy('https://api.foleon.com/v2/magazine/edition'));
  app.use('/projects', controller.proxy('https://api.foleon.com/v2/magazine/title'));

  app.listen(port);
  console.log(`Server has been launched on ${port} port.`);
}

main();
