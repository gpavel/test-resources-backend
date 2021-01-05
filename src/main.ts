import express from 'express';
import path from 'path';
import cors from 'cors';
import { config } from 'dotenv';

import { FoleonAuthManager } from './utils/FoleonTokenManager';
import { ExpressProxyController } from './controllers/AuthProxyController';
// import { StubAuthManager } from './utils/StubAuthManager';

function initializeDefaultConfig(): Record<string, any>  {
  return config({ path: path.resolve(__dirname, '../default.env') }).parsed ?? {};
}

function initializeUserConfig(): Record<string, any> {
  return config().parsed ?? {};
}

export function main(): void {
  initializeUserConfig();
  initializeDefaultConfig();
  const { env } = process;

  const app = express();
  const port = parseInt(env.PORT as string, 10);

  const tokenManager = new FoleonAuthManager(
    env?.FOLEON_OAUTH_URL as string,
    env?.FOLEON_CLIENT_ID as string,
    env?.FOLEON_CLIENT_SECRET as string,
  );

  const controller = new ExpressProxyController(
    tokenManager,
    // new StubAuthManager(),
  );

  const corsClientOrigins = (env.CLIENT_ORIGIN as string).split(',');

  app.use(cors({ origin: corsClientOrigins }));

  // TODO: remove the test URL once API is tested
  app.use('/test', controller.proxy('http://localhost:3000/proxied'));
  app.use('/publications', controller.proxy('https://api.foleon.com/v2/magazine/edition'));
  app.use('/projects', controller.proxy('https://api.foleon.com/v2/magazine/title'));
  // TODO: remove the test proxy URL once API is tested
  app.use('/proxied', (req, res) => {
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
