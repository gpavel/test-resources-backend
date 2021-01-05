import express from 'express';
import path from 'path';
import cors from 'cors';
import { config } from 'dotenv';

import { FoleonAuthManager } from './utils/FoleonTokenManager';
import { ExpressProxyController } from './controllers/AuthProxyController';
// import { StubAuthManager } from './utils/StubAuthManager';

const DEFAULT_PORT = 3000;

function initializeDefaultConfig(): Record<string, any>  {
  return config({ path: path.resolve(__dirname, '../.env.default') }).parsed ?? {};
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
    // new StubAuthManager(),
  );

  app.use(cors({ origin: (configuration.CLIENT_ORIGIN as string).split(',') }));
  app.use('/test', controller.proxy('http://localhost:3000/hello-world'));
  app.use('/publications', controller.proxy('https://api.foleon.com/v2/magazine/edition'));
  app.use('/projects', controller.proxy('https://api.foleon.com/v2/magazine/title'));

  app.use('/hello-world', (req, res) => {
    res.status(200).json({
      query: req.query,
      body: req.body,
      headers: req.headers,
      params: req.params,
    });
  })

  app.listen(port);
  console.log(`Server has been launched on ${port} port.`);
}

main();
